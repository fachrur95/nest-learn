import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  protected readonly logger: Logger;

  constructor(private readonly usersService: UsersService) {
    super({ usernameField: 'username' });
  }

  public async validate(username: string, password: string): Promise<User> {
    try {
      return await this.usersService.verifyUser(username, password);
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
