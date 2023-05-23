import { IsInt, IsUUID, Min } from 'class-validator';

export class UpdateCartDto {
  @IsInt()
  @Min(0)
  count: number;

  @IsUUID('4')
  productId: string;
}
