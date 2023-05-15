import { Injectable } from '@nestjs/common';

import { User } from '../models';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async findOne(userId: string) {
    return await this.usersRepository.findById(userId);
  }

  async createOne(user: User) {
    const newUser = this.usersRepository.createUser(user);
    return newUser;
  }
}
