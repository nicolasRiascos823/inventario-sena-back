import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassroomEntity } from './classroom.entity';
import { FichaEntity } from './ficha.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'reports' })
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 16 })
  type!: string;

  @Column({ type: 'uuid' })
  instructorId!: string;

  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'instructorId' })
  instructor!: UserEntity;

  @Column({ type: 'uuid' })
  classroomId!: string;

  @ManyToOne(() => ClassroomEntity, (c) => c.reports, {
    eager: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classroomId' })
  classroom!: ClassroomEntity;

  @Column({ type: 'uuid' })
  fichaId!: string;

  @ManyToOne(() => FichaEntity, { eager: true, onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'fichaId' })
  ficha!: FichaEntity;

  @Column({ type: 'int' })
  laptops!: number;

  @Column({ type: 'int' })
  mouses!: number;

  @Column({ type: 'int' })
  chargers!: number;

  @Column({ type: 'int' })
  tables!: number;

  @Column({ type: 'int' })
  chairs!: number;

  @Column({ type: 'text', nullable: true })
  observacion!: string | null;

  @CreateDateColumn()
  reportedAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
