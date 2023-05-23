import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UpdateCartDto } from '../../cart/dto';

class Address {
  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  comment?: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}

export class CreateOrderBodyDto {
  @ValidateNested()
  address: Address;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateCartDto)
  items: UpdateCartDto[];
}
