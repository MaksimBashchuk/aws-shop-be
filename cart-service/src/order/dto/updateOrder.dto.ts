import { OrderStatus } from '@prisma/client';
import { IsArray, IsIn, IsOptional } from 'class-validator';

export class UpdateOrderDto {
  @IsOptional()
  @IsIn(['OPEN', 'APPROVED', 'CONFIRMED', 'SENT', 'COMPLETED', 'CANCELLED'])
  status: OrderStatus;

  comments: string;
}
