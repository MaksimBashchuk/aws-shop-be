import { Injectable } from '@nestjs/common';
import { Prisma, Cart } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCartDto } from './dto/updateCart.dto';
// import { CartItem } from './models';

@Injectable()
export class CartRepository {
  constructor(private prisma: PrismaService) {}

  findCartByUserId = async (userId: string) => {
    const cart = await this.prisma.cart.findUnique({
      where: { userId: userId },
      include: { cartItems: true },
    });

    return cart;
  };

  createCart = async (userId: string) => {
    // const input: Prisma.CartCreateArgs = ;

    // if (cartItems) {
    //   const cartItemsToCreate = cartItems.map(({ count, productId }) => ({
    //     count,
    //     productId: productId,
    //   }));

    //   input.data.cartItems = { createMany: { data: cartItemsToCreate } };
    //   input.include = { cartItems: true };
    // }

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

  updateCart = async (userId: string, { count, productId }: UpdateCartDto) => {
    return await this.prisma.cart.update({
      where: { userId: userId },
      data: {
        cartItems: {
          upsert: {
            where: { productId: productId },
            create: { count, productId: productId },
            update: { count, productId: productId },
          },
        },
      },
      include: { cartItems: true },
    });
  };

  deleteCart = async (userId: string) => {
    return await this.prisma.cart.delete({ where: { userId: userId } });
  };
}
