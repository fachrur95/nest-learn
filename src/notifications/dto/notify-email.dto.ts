import { IsEmail, IsEnum, IsString, NotEquals } from 'class-validator';
import { TokenType } from 'src/auth/users/entities/token.entity';

export class NotifyEmailDto {
  constructor({ email, text, subject = TokenType.REFRESH }: NotifyEmailDto) {
    this.email = email;
    this.text = text;
    this.subject = subject;
  }

  @IsEmail()
  email: string;

  @IsString()
  text: string;

  @IsEnum(TokenType)
  @NotEquals(TokenType.REFRESH)
  subject: TokenType;
}
