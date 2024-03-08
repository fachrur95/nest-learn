import { Logger, NotFoundException } from '@nestjs/common';
import { EntityManager, FindOptionsWhere, Repository } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export type DynamicObject = {
  [key: string]: any;
};

export abstract class AbstractRepository<T> {
  protected abstract readonly logger: Logger;

  constructor(
    private readonly entityRepository: Repository<T>,
    private readonly entityManager: EntityManager,
  ) {}

  private getRepositoryBaseQuery(alias?: string) {
    return this.entityRepository.createQueryBuilder(alias);
  }

  async create(entity: T): Promise<T> {
    return this.entityManager.save(entity);
  }

  /* async findOne(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    isSkipNotFound: boolean = false,
  ): Promise<T> {
    const entity = await this.entityRepository.findOne({ where });

    if (!entity) {
      this.logger.warn(`Entity not found with where: ${where}`);
      if (!isSkipNotFound) {
        throw new NotFoundException('Entity not found');
      }
    }

    return entity;
  } */

  async findOne(
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    isSkipNotFound: boolean = false,
  ) {
    const entity = this.getRepositoryBaseQuery('entity').andWhere(where);

    if (!(await entity.getOne())) {
      this.logger.warn(`Entity not found with where: ${where}`);
      if (!isSkipNotFound) {
        throw new NotFoundException('Entity not found');
      }
    }

    return entity;
  }

  async findOneAndUpdate(
    where: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<T> {
    const updateResult = await this.entityRepository.update(
      where,
      partialEntity,
    );

    if (!updateResult.affected) {
      this.logger.warn(`Entity not found with where: ${where}`);
      throw new NotFoundException('Entity not found');
    }

    return (await this.findOne(where)).getOne();
  }

  async find(alias?: string) {
    return this.getRepositoryBaseQuery(alias);
  }

  async findOneAndDelete(
    where: FindOptionsWhere<T>,
    isSkipNotFound: boolean = false,
  ) {
    await this.findOne(where, isSkipNotFound);
    return this.entityRepository.delete(where);
  }
}
