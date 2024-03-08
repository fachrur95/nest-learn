import { AbstractEntity } from '@app/common';
import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Token } from './token.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  @Expose()
  username!: string;

  @Column()
  password!: string;

  @Column({ unique: true })
  @Expose()
  email!: string;

  @Column()
  @Expose()
  firstName!: string;

  @Column()
  @Expose()
  lastName!: string;

  @Column({ nullable: true })
  otpCode?: string;

  @Expose()
  @OneToMany(() => Token, (token) => token.id)
  tokens: Token[];
}
