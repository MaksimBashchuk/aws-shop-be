import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../order.repository';
import { CreateOrderBodyDto, UpdateOrderDto } from '../dto';

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}

  async findById(orderId: string) {
    return await this.orderRepository.findByOrderId(orderId);
  }

  async findAllByUserId(userId: string) {
    return await this.orderRepository.findAllByUserId(userId);
  }

  async update(orderId: string, data: UpdateOrderDto) {
    return await this.orderRepository.updateOrder(orderId, data);
  }

  async create(userId: string, body: CreateOrderBodyDto) {
    return await this.orderRepository.create(userId, body);
  }

  async delete(id: string) {
    return await this.orderRepository.delete(id);
  }
}
