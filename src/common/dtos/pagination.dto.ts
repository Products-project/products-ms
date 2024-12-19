import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  page?: number = 1;

  @IsNumber({
    maxDecimalPlaces: 0,
  })
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number = 5;
}
