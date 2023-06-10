import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import { CreateTemplateDto } from './dto/create-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Template } from './entities/template.entity';
import { DeepPartial, Repository } from 'typeorm';
import { S3Service } from '../s3/s3.service';
import { ExtendedConfigService } from '../config/extended-config.service';

@Injectable()
export class TemplatesService {
  constructor(
    @InjectRepository(Template)
    private readonly templatesRepository: Repository<Template>,
    private readonly s3Service: S3Service,
    private readonly config: ExtendedConfigService
  ) {}

  public async findOneNullable(
    props: DeepPartial<Template>
  ): Promise<Template | null> {
    return await this.templatesRepository.findOneBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      userGuid: props.userGuid,
      archiveFileName: props.archiveFileName
    });
  }

  public async findOne(props: DeepPartial<Template>): Promise<Template> {
    const template = await this.findOneNullable(props);

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return template;
  }

  public async create(
    userGuid: string,
    archive: Buffer,
    dto: CreateTemplateDto
  ): Promise<Template> {
    const existingTemplate = await this.findOneNullable({
      name: dto.name,
      userGuid
    });

    if (existingTemplate) {
      throw new UnprocessableEntityException(
        'Template with this name already exists'
      );
    }

    const archiveFileName = await this.s3Service.putObject(
      this.config.get('minio.buckets.templatesBucket'),
      archive
    );

    const template = await this.templatesRepository.save({
      name: dto.name,
      archiveFileName
    });

    return template;
  }

  public async findAll(props: DeepPartial<Template>): Promise<Template[]> {
    return await this.templatesRepository.findBy({
      id: props.id,
      guid: props.guid,
      name: props.name,
      userGuid: props.userGuid,
      archiveFileName: props.archiveFileName
    });
  }
}
