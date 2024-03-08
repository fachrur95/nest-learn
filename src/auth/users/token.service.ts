import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Token, TokenType } from './entities/token.entity';
import { User } from './entities/user.entity';
import { TokensRepository } from './token.repository';

@Injectable()
export class TokensService {
  protected readonly logger = new Logger(TokensService.name);

  constructor(private readonly tokensRepository: TokensRepository) {}

  // TODO generate OTP function
  public generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp: string = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  public async create(token: string, user: User) {
    const entityToken = new Token();

    entityToken.token = token;
    entityToken.user = user;
    entityToken.createdBy = user.email;

    return this.tokensRepository.create(entityToken);
  }

  public async verifyToken(token: string, user: User, type: TokenType) {
    const tokenFound = await this.tokensRepository.findOne({
      userId: user.id,
      type,
      token,
    });
    if (!tokenFound) {
      throw new BadRequestException('Token invalid');
    }

    return tokenFound;
  }

  public async findOne(user: User, type: TokenType) {
    const token = await this.tokensRepository.findOne({ user, type });
    if (!(await token.getOne())) {
      throw new BadRequestException('Token invalid');
    }

    return await token.getOne();
  }

  public remove(user: User, type: TokenType) {
    return this.tokensRepository.findOneAndDelete({ user, type }, true);
  }
}
