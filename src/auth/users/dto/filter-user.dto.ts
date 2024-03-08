import { Property } from '@app/common';
import { IsOptional, IsString } from 'class-validator';

export class FilterUserDto {
  @Property()
  @IsString()
  @IsOptional()
  username: string;

  @Property()
  @IsString()
  @IsOptional()
  email: string;

  @Property()
  @IsString()
  @IsOptional()
  firstName?: string;

  @Property()
  @IsString()
  @IsOptional()
  lastName?: string;
}
