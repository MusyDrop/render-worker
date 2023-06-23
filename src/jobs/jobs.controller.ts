import { Controller, OnModuleInit } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { KafkaTopicController } from '../kafka/kafka-topic-controller.interface';
import { RenderJobPayload } from './render-job-payload.interface';
import { Consumer } from 'kafkajs';
import { ExtendedConfigService } from '../config/extended-config.service';
import { S3Service } from '../s3/s3.service';
import fs from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'path';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import AdmZip from 'adm-zip';
import { generateUniqueId } from '../utils/unique-id-generator';
import { DownloadedRenderAssets } from './interfaces/downloaded-render-assets.interface';
import { RenderNecessities } from './interfaces/render-necessities.interface';
import { render } from '@nexrender/core';
import { decompress } from '../utils/compression';
import { streamToBuffer } from '../utils/other-utils';
import { AnyObject } from '../utils/utility-types';
import { promisify } from 'node:util';
import { RenderServiceApiClient } from '../render-service/render-service.api-client';
import { JobStatus } from '../render-service/job-status.enum';

@Controller()
export class JobsController
  implements KafkaTopicController<RenderJobPayload>, OnModuleInit
{
  protected consumer: Consumer;
  public readonly topicName = 'AERendererJobs';
  public readonly groupName = 'ae-render-workers';
  private readonly projectsDir = path.resolve(tmpdir(), this.topicName);

  constructor(
    private readonly kafkaService: KafkaService,
    private readonly config: ExtendedConfigService,
    private readonly s3Service: S3Service,
    @InjectPinoLogger(JobsController.name) private readonly logger: PinoLogger,
    private readonly renderServiceApiClient: RenderServiceApiClient
  ) {}

  public async execute(
    message: RenderJobPayload,
    key: string | null | undefined
  ): Promise<void> {
    try {
      this.consumer.pause([{ topic: this.topicName }]);
      const renderId = generateUniqueId();
      this.logger.info(
        `execute: renderId: ${renderId}, received message ${message.jobGuid}`
      );

      await this.renderServiceApiClient.updateJob(message.jobGuid, {
        status: JobStatus.IN_PROGRESS
      });

      const { renderFolderPath, audioFilePath } = await this.downloadAssets(
        message,
        renderId
      );

      const uncompressedRms = await decompress(message.compressedRms);
      this.logger.info('execute: decompressed RMS');

      const artifactPath = await this.startRenderProcess(message.jobGuid, {
        keyframes: uncompressedRms,
        audioDurationSecs: message.audioDurationSecs,
        audioFilePath,
        renderFolderPath,
        outputFolderPath: renderFolderPath,
        settings: message.settings
      });

      const artifactStream = createReadStream(artifactPath);

      const artifactId = await this.s3Service.putObject(
        this.config.get('minio.buckets.artifactsBucket'),
        artifactStream
      );

      await this.renderServiceApiClient.updateJob(message.jobGuid, {
        artifact: artifactId,
        status: JobStatus.SUCCEEDED
      });
    } catch (e) {
      this.logger.error(`execute: failed, error: ${(e as AnyObject).message}`);
      await this.renderServiceApiClient.updateJob(message.jobGuid, {
        status: JobStatus.FAILED
      });
    } finally {
      this.consumer.resume([{ topic: this.topicName }]);
    }
  }

  /**
   * @returns audio file path
   * @param message
   * @param renderId
   */
  private async downloadAssets(
    message: RenderJobPayload,
    renderId: string
  ): Promise<DownloadedRenderAssets> {
    this.logger.info(`downloadAssets: started`);
    const renderFolderPath = `${this.projectsDir}/${renderId}`;
    await fs.mkdir(renderFolderPath);

    const templateArchiveStream = await this.s3Service.getObject(
      this.config.get('minio.buckets.templatesBucket'),
      message.archiveFileName
    );

    const audioFileStream = await this.s3Service.getObject(
      this.config.get('minio.buckets.audioFilesBucket'),
      message.audioFileName
    );

    const templateArchiveBuffer = await streamToBuffer(templateArchiveStream);
    const zip = new AdmZip(templateArchiveBuffer);
    await promisify(zip.extractAllToAsync)(renderFolderPath, false, false);

    this.logger.info(
      `downloadAssets: extracted template archive: ${renderFolderPath}`
    );

    const audioFilePath = `${renderFolderPath}/${message.audioFileName}.wav`;
    await fs.writeFile(audioFilePath, audioFileStream);
    this.logger.info(`downloadAssets: downloaded audio file: ${audioFilePath}`);

    return {
      renderFolderPath,
      audioFilePath
    };
  }

  private async startRenderProcess(
    jobGuid: string,
    necessities: RenderNecessities
  ): Promise<string> {
    this.logger.info(`startRenderProcess: started`);

    const config = this.composeRenderSettings(jobGuid, necessities);

    await render(config, {
      debug: true,
      skipCleanup: true
    });

    return `${necessities.outputFolderPath}/render.mp4`;
  }

  public async onModuleInit(): Promise<any> {
    this.logger.info(`Projects directory: ${this.projectsDir}`);

    this.consumer = await this.kafkaService.on(
      this.topicName,
      this.groupName,
      this.execute.bind(this) // Important! Otherwise, we lose context!
    );

    if (!existsSync(this.projectsDir)) {
      this.logger.info('Created projects directory');
      await fs.mkdir(this.projectsDir);
    }

    setInterval(() => {
      this.logger.info(`health status: healthy`);
    }, 3000);
  }

  public composeRenderSettings(
    jobGuid: string,
    necessities: RenderNecessities
  ): AnyObject {
    this.logger.info(`composeRenderSettings: started`);
    const mainScriptAssetPath = path.resolve(
      process.cwd(),
      'src',
      'jobs',
      'assets',
      'main.jsx'
    );

    const secondsIncrement =
      necessities.audioDurationSecs / necessities.keyframes.length;

    let timeCounter = 0;
    // seconds fractions or times at which we set the keyframes
    const times = necessities.keyframes.map(() => {
      const time = timeCounter;
      timeCounter += secondsIncrement;
      return time;
    });

    return {
      template: {
        src: `file://${necessities.renderFolderPath}/template.aep`,
        composition: 'main'
      },
      assets: [
        {
          src: `file://${necessities.audioFilePath}`,
          type: 'audio',
          layerName: 'audio-layer'
        },
        // {
        //   src: 'file:///Users/admin/Code/solecold/musydrop/be-poc/projects/2/replacement.jpg',
        //   type: 'image',
        //   layerName: 'image-layer'
        // }
        {
          src: `file://${mainScriptAssetPath}`,
          type: 'script',
          parameters: [
            {
              key: 'keyframes',
              value: necessities.keyframes
            },
            {
              key: 'times',
              value: times
            }
          ]
        }
      ],
      actions: {
        postrender: [
          {
            module: '@nexrender/action-encode',
            preset: 'mp4',
            output: 'encoded.mp4'
          },
          {
            module: '@nexrender/action-copy',
            input: 'encoded.mp4',
            output: `${necessities.outputFolderPath}/render.mp4`
          }
        ]
      },
      onChange: async (job: AnyObject, state: string): Promise<void> => {
        this.logger.info(`Status changed: ${state}`);
        if (state === 'error') {
          this.logger.error(`Current job: ${jobGuid} has FAILED`);
          await this.renderServiceApiClient.updateJob(jobGuid, {
            status: JobStatus.FAILED
          });
        }
      }
    };
  }
}
