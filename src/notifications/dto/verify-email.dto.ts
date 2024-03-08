import { IsEmail, IsString } from 'class-validator';

export class VerifyEmailDto {
  constructor({ email, name, otp }: VerifyEmailDto) {
    this.email = email;
    this.name = name;
    this.otp = otp;
  }

  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  otp: string;
}
