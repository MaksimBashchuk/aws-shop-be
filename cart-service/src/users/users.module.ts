import { Module } from '@nestjs/common';

import { UsersService } from './services';
import { PrismaModule, PrismaService } from '../prisma';
import { UsersRepository } from './users.repository';

@Module({
  imports: [PrismaModule],
  providers: [UsersService, PrismaService, UsersRepository],
  exports: [UsersService],
})
export class UsersModule {}
