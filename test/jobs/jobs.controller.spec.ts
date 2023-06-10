import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../../src/jobs/jobs.controller';
import { JobsService } from '../../src/jobs/jobs.service';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsService]
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
