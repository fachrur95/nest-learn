import { AbstractEntity } from '@app/common';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Expose } from 'class-transformer';

export enum TokenType {
  REFRESH = 'refresh',
  VERIFY = 'verify',
  FORGOT = 'forgot',
}

@Entity()
export class Token extends AbstractEntity {
  @Column()
  @Expose()
  token!: string;

  @Column({ type: 'enum', enum: TokenType, default: TokenType.REFRESH })
  @Expose()
  type!: TokenType;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn()
  user: User;

  @Column()
  userId: number;
}
