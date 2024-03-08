import { IsEmail, IsString } from 'class-validator';

export class WelcomeEmailDto {
  constructor({ email, name }: WelcomeEmailDto) {
    this.email = email;
    this.name = name;
  }

  @IsEmail()
  email: string;

  @IsString()
  name: string;
}
