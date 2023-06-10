import { Injectable } from '@nestjs/common';
// import { Client } from 'pg';
import { ExtendedConfigService } from '../config/extended-config.service';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export class DbService {
  constructor(
    private readonly config: ExtendedConfigService,
    @InjectPinoLogger(DbService.name) private readonly logger: PinoLogger
  ) {}

  // public static initialiseDatabase(
  //   config: ExtendedConfigService,
  // ): Promise<void> {
  //   const client = new Client({
  //     host: config.get('postgres.host'),
  //     port: config.get('postgres.port'),
  //     user: config.get('postgres.username'),
  //     password: config.get('postgres.password')
  //   });
  //   await client.connect();
  //
  //   const database = this.config.get('postgres.database');
  //
  //   try {
  //     const raw = await client.query(
  //       `CREATE DATABASE ${this.config.get('postgres.database')}`
  //     );
  //     console.log(raw);
  //
  //     this.logger.info(`Successfully created database: ${database}`);
  //   } catch (e) {
  //     if (!e.message.includes('already exists')) {
  //       throw e;
  //     }
  //
  //     this.logger.info(
  //       `Database ${database} already exists, skipping the creation...`
  //     );
  //   }
  //
  //   await client.end();
  // }
}
