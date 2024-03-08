import { PaginationDto } from '@app/common';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { FilterUserDto } from './filter-user.dto';

export class FindAllUserDto extends PaginationDto {
  @ValidateNested()
  @IsOptional()
  filter?: FilterUserDto;

  @IsString()
  @IsOptional()
  search?: string;
}
