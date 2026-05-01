import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassroomEntity } from './classroom.entity';

@Entity({ name: 'classroom_inventories' })
export class ClassroomInventoryEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid', unique: true })
  classroomId!: string;

  @OneToOne(() => ClassroomEntity, (c) => c.inventory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroomId' })
  classroom!: ClassroomEntity;

  @Column({ type: 'int', default: 0 })
  laptops!: number;

  @Column({ type: 'int', default: 0 })
  mouses!: number;

  @Column({ type: 'int', default: 0 })
  chargers!: number;

  @Column({ type: 'int', default: 0 })
  tables!: number;

  @Column({ type: 'int', default: 0 })
  chairs!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
