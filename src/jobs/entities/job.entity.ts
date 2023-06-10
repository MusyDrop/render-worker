import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Generated,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { Template } from '../../templates/entities/template.entity';
import { JobStatus } from '../enums/job-status.enum';
import { JobDto } from '../dtos/job.dto';
import { AnyObject } from '../../utils/utility-types';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Generated('uuid')
  guid: string;

  @ManyToOne(() => Template, {
    nullable: false,
    cascade: true,
    onDelete: 'CASCADE'
  })
  @JoinColumn()
  template: Template;

  @Column({ name: 'audio_file_name' })
  audioFileName: string;

  @Column({ type: 'uuid', name: 'user_guid' })
  userGuid: string;

  @Column({ type: 'jsonb', default: {} })
  settings: AnyObject;

  @Column({ default: JobStatus.PENDING })
  status: JobStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  public static toDto(job?: Job): JobDto | null {
    if (!job) return null;
    return {
      guid: job.guid,
      status: job.status,
      createdAt: job.createdAt,
      templateGuid: job.template.guid,
      audioFileName: job.audioFileName,
      settings: job.settings,
      userGuid: job.userGuid
    };
  }
}
