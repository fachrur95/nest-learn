import { Expose } from 'class-transformer';
import { SelectQueryBuilder } from 'typeorm';

export interface PaginateOptions {
  limit: number;
  currentPage: number;
  total?: boolean;
}

export class PaginationResult<T> {
  constructor(partial: Partial<PaginationResult<T>>) {
    Object.assign(this, partial);
  }

  @Expose()
  first: number;

  @Expose()
  last: number;

  @Expose()
  currentPage: number;

  @Expose()
  maxPages: number;

  @Expose()
  limit: number;

  @Expose()
  count: number;

  @Expose()
  total?: number;

  @Expose()
  data: T[];
}

export async function paginate<T>(
  qb: SelectQueryBuilder<T>,
  options?: PaginateOptions,
): Promise<PaginationResult<T>> {
  const currentPage = options.currentPage ?? 1;
  const limit = options.limit ?? 10;

  const offset = (currentPage - 1) * limit;

  const data = await qb.limit(limit).offset(offset).getMany();

  const countAll = await qb.getCount();

  const maxPages = Math.ceil(countAll / limit);

  const result: PaginationResult<T> = new PaginationResult({
    first: offset + 1,
    last: offset + data.length,
    currentPage: currentPage,
    maxPages,
    limit: limit,
    count: data.length,
    total: options.total ? countAll : undefined,
    data,
  });

  return result;
}
