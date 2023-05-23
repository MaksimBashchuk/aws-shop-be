import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartDto } from './dto/updateCart.dto';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  findCartByUserId = async (userId: string) => {
    const cart = await this.prisma.cart.findFirst({
      where: { userId: userId, status: 'OPEN' },
      include: { cartItems: true },
    });

    return cart;
  };

  createCart = async (userId: string) => {
    const createdCart = await this.prisma.cart.create({
      data: {
        userId: userId,
        status: 'OPEN',
        cartItems: { createMany: { data: [] } },
      },
      include: { cartItems: true },
    });
    return createdCart;
  };

  updateCart = async (cartId: string, { count, productId }: UpdateCartDto) => {
    return await this.prisma.$transaction(async (client) => {
      let cartItem = await client.cartItem.findFirst({
        where: { cartId, productId },
      });

      if (!cartItem) {
        cartItem = await this.prisma.cartItem.create({
          data: { cart: { connect: { id: cartId } }, count, productId },
        });
      } else {
        cartItem = await this.prisma.cartItem.update({
          where: { id: cartItem.id },
          data: { count },
        });
      }

      return cartItem;
    });
  };

  deleteCart = async (userId: string) => {
    return await this.prisma.$transaction(async (client) => {
      const { id } = await client.cart.findFirst({
        where: { user: { is: { id: userId } }, status: 'OPEN' },
        select: { id: true },
      });

      return await this.prisma.cart.delete({ where: { id } });
    });
  };
}
