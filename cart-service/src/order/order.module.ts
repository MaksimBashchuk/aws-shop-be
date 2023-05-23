import { Module } from '@nestjs/common';
import { OrderService } from './services';
import { PrismaModule } from '../prisma';
import { OrderRepository } from './order.repository';
import { OrderController } from './order.controller';

@Module({
  imports: [PrismaModule],
  providers: [OrderService, OrderRepository],
  controllers: [OrderController],
  exports: [OrderService],
})
export class OrderModule {}
