import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  limit: number;

  @IsNumber()
  @IsOptional()
  currentPage: number;

  @IsBoolean()
  @IsOptional()
  total?: boolean;
}
