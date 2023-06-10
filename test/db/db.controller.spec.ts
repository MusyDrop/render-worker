import { Test, TestingModule } from '@nestjs/testing';
import { DbController } from '../../src/db/db.controller';
import { DbService } from '../../src/db/db.service';

describe('DbController', () => {
  let controller: DbController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DbController],
      providers: [DbService]
    }).compile();

    controller = module.get<DbController>(DbController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
