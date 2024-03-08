import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Res,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/local-jwt.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { TokenType } from './users/entities/token.entity';
import { User } from './users/entities/user.entity';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller('auth')
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { token, expires } = this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return {
      username: user.username,
      token: {
        accessToken: token,
        refreshToken,
      },
    };
  }

  @Post('register')
  async registration(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.authService.registration(createUserDto);

    return {
      message: `Verification Email has been sent to email: ${newUser.email}`,
    };
  }

  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @CurrentUser() user: User,
    @Body() refreshTokenDto: RefreshTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.tokenVerify(
      refreshTokenDto.refreshToken,
      user,
      TokenType.REFRESH,
    );
    const { token, expires } = this.authService.generateAccessToken(user);
    const refreshToken = await this.authService.generateRefreshToken(user);

    response.cookie('Authentication', token, {
      httpOnly: true,
      expires,
    });

    return {
      token: {
        accessToken: token,
        refreshToken,
      },
    };
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async getSession(@CurrentUser() user: User) {
    return user;
  }
}
