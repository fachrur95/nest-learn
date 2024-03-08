import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { TokenType } from './users/entities/token.entity';
import { User } from './users/entities/user.entity';
import { TokensService } from './users/token.service';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';
import { VerifyEmailDto } from 'src/notifications/dto/verify-email.dto';
import { TypedEventEmitter } from 'src/event-emitter/typed-event-emitter.class';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
    private readonly usersService: UsersService,
    // private readonly eventEmitter: EventEmitter2,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  private generateToken(user: User, options?: JwtSignOptions) {
    return this.jwtService.sign(
      { username: user.username, sub: user.id },
      options,
    );
  }

  public generateAccessToken(user: User) {
    const token = this.generateToken(user);

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() +
        this.configService.getOrThrow('JWT_EXPIRATION_IN_SECONDS'),
    );

    return { token, expires };
  }

  public async generateRefreshToken(user: User) {
    const token = this.generateToken(user, {
      expiresIn: `${this.configService.getOrThrow('JWT_REFRESH_EXPIRATION_IN_DAYS')}d`,
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
    });

    // Delete all token
    await this.tokensService.remove(user, TokenType.REFRESH);

    await this.tokensService.create(token, user);

    return token;
  }

  public async tokenVerify(token: string, user: User, type: TokenType) {
    const isValid = await this.tokensService.verifyToken(token, user, type);

    if (!isValid) {
      throw new BadRequestException('Refresh Token invalid');
    }

    return isValid;
  }

  public async registration(user: CreateUserDto) {
    try {
      const otpCode = this.generateOTP();

      const newUser = await this.usersService.create({ ...user, otpCode });

      this.eventEmitter.emit(
        'notification.verify-email',
        new VerifyEmailDto({
          email: newUser.email,
          name: `${newUser.firstName} ${newUser.lastName}`,
          otp: otpCode,
        }),
      );

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  // TODO add function generate OTP
  public generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp: string = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }
}
