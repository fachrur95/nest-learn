import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './entities/token.entity';
import { User } from './entities/user.entity';
import { TokensRepository } from './token.repository';
import { TokensService } from './token.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([User, Token]),
    Repository,
  ],
  controllers: [UsersController],
  providers: [UsersService, TokensService, UsersRepository, TokensRepository],
  exports: [UsersService, TokensService],
})
export class UsersModule {}
