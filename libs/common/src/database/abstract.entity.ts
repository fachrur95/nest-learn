import { Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id!: number;

  @Column({ type: 'boolean', default: true })
  @Expose()
  isActive!: boolean;

  @Column({ type: 'boolean', default: false })
  isArchived!: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  createdAt!: Date;

  @Column({ type: 'varchar', length: 300 })
  @Expose()
  createdBy!: string;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  @Expose()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 300, nullable: true })
  @Expose()
  updatedBy: string;
}
