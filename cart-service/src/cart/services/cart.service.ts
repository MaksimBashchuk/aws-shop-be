import { Injectable } from '@nestjs/common';

import { v4 } from 'uuid';

import { CartRepository } from '../cart.repository';
import { UpdateCartDto } from '../dto/updateCart.dto';
import { Cart, CartItem } from '@prisma/client';
// import { Cart } from '../models';

@Injectable()
export class CartService {
  // private userCarts: Record<string, Cart> = {};
  constructor(private cartRepository: CartRepository) {}

  async findByUserId(userId: string) {
    const cart = await this.cartRepository.findCartByUserId(userId);
    return cart;
  }

  async createByUserId(userId: string) {
    const createdCart = await this.cartRepository.createCart(userId);
    return createdCart;
  }

  async findOrCreateByUserId(userId: string) {
    let userCart: Cart & {
      cartItems: CartItem[];
    };
    userCart = await this.findByUserId(userId);

    if (!userCart) {
      userCart = await this.createByUserId(userId);
    }

    const response = await fetch(
      'https://t181oeitnb.execute-api.us-east-1.amazonaws.com/dev/products',
    );
    const products = await response.json();
    const data = userCart.cartItems.map(({ productId, count }) => {
      const product = products.find((product) => product.id === productId);

      return {
        product,
        count,
      };
    });

    return {
      ...userCart,
      data,
    };
  }

  async updateByUserId(userId: string, body: UpdateCartDto) {
    const cart = await this.findOrCreateByUserId(userId);
    return await this.cartRepository.updateCart(cart.userId, body);
  }

  async removeByUserId(userId: string) {
    return await this.cartRepository.deleteCart(userId);
  }
}
