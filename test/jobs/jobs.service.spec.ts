import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../../src/jobs/jobs.controller';

describe('JobsService', () => {
  let service: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JobsController]
    }).compile();

    service = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
