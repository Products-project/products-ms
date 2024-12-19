import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @Min(0)
  @Type(() => Number)
  price: number;
}
