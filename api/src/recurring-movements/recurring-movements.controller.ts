import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { RecurringMovementsService } from './recurring-movements.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth/jwt-auth.guard.js';
import { CreateRecurringMovementDto } from './dto/create-recurring-movements.dto.js';
import { UpdateRecurringMovementsDto } from './dto/update-recurring-movements.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('recurring-movements')
export class RecurringMovementsController {
  constructor(
    private readonly recurringMovementsService: RecurringMovementsService,
  ) {}

  // get a list of all rules with the category they apply and the amount
  @Get()
  getAll() {
    return this.recurringMovementsService.getAll();
  }

  // get one
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: number) {
    return this.recurringMovementsService.getOne(id);
  }

  //create one
  @Post()
  createOne(@Body() body: CreateRecurringMovementDto) {
    return this.recurringMovementsService.createOne(body);
  }

  // update one
  @Patch(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRecurringMovementsDto,
  ) {
    return this.recurringMovementsService.updateOne(id, body);
  }

  // TODO
  // change value of a recurring movement -> ??
  // será un patch y un post ?? porqué necesitaré hacer que la que había reciba una end date, y crear una nueva que apunte a la misma catgoria

  // TODO
  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number) {}
}
