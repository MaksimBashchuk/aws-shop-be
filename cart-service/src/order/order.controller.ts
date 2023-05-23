import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './services';
import { BasicAuthGuard } from '../auth';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { UpdateOrderDto, OrderIdParamDto, CreateOrderBodyDto } from './dto';

@Controller('/order')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @UseGuards(BasicAuthGuard)
  @Get()
  async findUserOrders(@Req() req: AppRequest) {
    const orders = await this.orderService.findAllByUserId(
      getUserIdFromRequest(req),
    );

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: orders,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Put()
  async createOrder(@Req() req: AppRequest, @Body() body: CreateOrderBodyDto) {
    await this.orderService.create(getUserIdFromRequest(req), body);
  }

  @UseGuards(BasicAuthGuard)
  @Put(':id')
  async updateOrder(
    @Param() { id }: OrderIdParamDto,
    @Body() body: UpdateOrderDto,
  ) {
    const updatedOrder = await this.orderService.update(id, body);

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id - ${id} does not found`);
    }

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: updatedOrder,
    };
  }

  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  async deleteOrder(@Param() { id }: OrderIdParamDto) {
    await this.orderService.delete(id);
  }
}
