import { IsEmail, IsString } from 'class-validator';

export class ForgotPasswordEmailDto {
  constructor({ email, name, link }: ForgotPasswordEmailDto) {
    this.email = email;
    this.name = name;
    this.link = link;
  }

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  link: string;
}
