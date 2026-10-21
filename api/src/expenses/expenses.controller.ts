import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { ExpensesService } from './expenses.service.js';

@Controller('expenses')
export class ExpensesController {
  private readonly expensesService: ExpensesService;

  constructor(expensesService: ExpensesService) {
    this.expensesService = expensesService;
  }

  @Post()
  createOne(@Body() body: CreateExpenseDto) {
    return this.expensesService.createOne(body);
  }
}
