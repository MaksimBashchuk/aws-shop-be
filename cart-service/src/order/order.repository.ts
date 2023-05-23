import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderBodyDto, UpdateOrderDto } from './dto';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  findByOrderId = async (orderId: string) => {
    return this.prisma.$transaction(async (client) => {
      const order = await client.order.findUnique({
        where: { id: orderId },
        include: {
          cart: {
            include: {
              cartItems: true,
            },
          },
        },
      });
      const items = await Promise.all(
        order.cart.cartItems.map((cartItem) =>
          fetch(
            `https://t181oeitnb.execute-api.us-east-1.amazonaws.com/dev/products/${cartItem.productId}`,
          )
            .then((res) => res.json())
            .then((data) => ({ ...data, count: cartItem.count })),
        ),
      );

      return {
        id: order.id,
        items,
        address: JSON.parse(order.delivery.toString()),
        statusHistory: [
          {
            status: order.status,
            timestamp: Date.now(),
            comment: order.comments,
          },
        ],
      };
    });
  };

  findAllByUserId = async (userId: string) => {
    return this.prisma.$transaction(async (client) => {
      const orders = await client.order.findMany({
        where: { userId },
        include: {
          cart: {
            include: {
              cartItems: true,
            },
          },
        },
      });

      return await Promise.all(
        orders.map(async (order) => {
          const items = await Promise.all(
            order.cart.cartItems.map((cartItem) =>
              fetch(
                `https://t181oeitnb.execute-api.us-east-1.amazonaws.com/dev/products/${cartItem.productId}`,
              )
                .then((res) => res.json())
                .then((data) => ({ ...data, count: cartItem.count })),
            ),
          );

          return {
            id: order.id,
            items,
            address: JSON.parse(order.delivery.toString()),
            statusHistory: [
              {
                status: order.status,
                timestamp: Date.now(),
                comment: order.comments,
              },
            ],
          };
        }),
      );
    });
  };

  create = async (userId: string, { address, items }: CreateOrderBodyDto) => {
    return await this.prisma.$transaction(async (client) => {
      const cart = await client.cart.findFirst({
        where: { userId, status: 'OPEN' },
      });

      await client.cart.update({
        where: { id: cart.id },
        data: { status: 'ORDERED' },
      });

      const delivery = JSON.stringify({
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        comment: address.comment,
      });

      const products = await Promise.all(
        items.map((item) =>
          fetch(
            `https://t181oeitnb.execute-api.us-east-1.amazonaws.com/dev/products/${item.productId}`,
          ).then((res) => res.json()),
        ),
      );

      const total = items.reduce((acc, item) => {
        const { price = 0 } = products.find(
          (product) => product.id === item.productId,
        );
        return (acc += item.count * price);
      }, 0);

      const createdOrder = await client.order.create({
        data: {
          status: 'OPEN',
          payment: '',
          comments: '',
          delivery,
          total,
          cart: { connect: { id: cart.id } },
          user: { connect: { id: userId } },
        },
      });

      return {
        id: createdOrder.id,
        items: products,
        address: createdOrder.delivery,
        statusHistory: [
          {
            status: createdOrder.status,
            timestamp: Date.now(),
            comment: createdOrder.comments,
          },
        ],
      };
    });
  };

  updateOrder = async (id: string, { comments, status }: UpdateOrderDto) => {
    return await this.prisma.order.update({
      where: { id },
      data: { status, comments },
    });
  };

  delete = async (id: string) => {
    return this.prisma.$transaction(async (client) => {
      const order = await client.order.findUnique({ where: { id } });
      return await client.cart.delete({ where: { id: order.cartId } });
    });
  };
}
