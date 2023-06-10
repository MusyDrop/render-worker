import { Test, TestingModule } from '@nestjs/testing';
import { JobsController } from '../../src/jobs/jobs.controller';
import { JobsController } from '../../src/jobs/jobs.controller';

describe('JobsController', () => {
  let controller: JobsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JobsController],
      providers: [JobsController]
    }).compile();

    controller = module.get<JobsController>(JobsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
