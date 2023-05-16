import { IsPositive, IsUUID } from 'class-validator';

export class UpdateCartDto {
  @IsPositive()
  count: number;

  @IsUUID('4')
  productId: string;
}
