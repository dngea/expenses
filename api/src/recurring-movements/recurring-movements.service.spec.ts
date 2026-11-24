import { Test, TestingModule } from '@nestjs/testing';
import { RecurringMovementsService } from './recurring-movements.service.js';

describe('RecurringMovementsService', () => {
  let service: RecurringMovementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RecurringMovementsService],
    }).compile();

    service = module.get<RecurringMovementsService>(RecurringMovementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
