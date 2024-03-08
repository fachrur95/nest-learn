import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Token } from './entities/token.entity';

@Injectable()
export class TokensRepository extends AbstractRepository<Token> {
  protected readonly logger = new Logger(TokensRepository.name);

  constructor(
    @InjectRepository(Token)
    tokensRepository: Repository<Token>,
    entityManager: EntityManager,
  ) {
    super(tokensRepository, entityManager);
  }
}
