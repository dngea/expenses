import { Body, Controller, Get, Post, Param, Query } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { ExpensesService } from './expenses.service.js';
import { ListExpensesQueryDto } from './dto/list-expenses-query.dto.js';

@Controller('expenses')
export class ExpensesController {
  private readonly expensesService: ExpensesService;

  constructor(expensesService: ExpensesService) {
    this.expensesService = expensesService;
  }

  @Get()
  getAll(@Query() query: ListExpensesQueryDto) {
    return this.expensesService.getAll(query);
  }

  @Get('summary')
  getSummary(@Query() query: ListExpensesQueryDto) {
    return this.expensesService.getSummary(query);
  }

  @Post()
  createOne(@Body() body: CreateExpenseDto) {
    return this.expensesService.createOne(body);
  }
}
