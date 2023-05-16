import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartRepository } from './cart.repository';

@Module({
  imports: [OrderModule, PrismaModule],
  providers: [CartService, CartRepository],
  controllers: [CartController],
})
export class CartModule {}
