import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { User } from './models';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  findById = async (userName: string) => {
    return await this.prisma.user.findUnique({ where: { name: userName } });
  };

  createUser = async ({ id, name, password, email }: User) => {
    return await this.prisma.user.create({
      data: { id: id ?? name, name, password, email },
    });
  };
}
