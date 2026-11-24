import { Test, TestingModule } from '@nestjs/testing';
import { RecurringMovementsController } from './recurring-movements.controller.js';

describe('RecurringMovementsController', () => {
  let controller: RecurringMovementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringMovementsController],
    }).compile();

    controller = module.get<RecurringMovementsController>(RecurringMovementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
