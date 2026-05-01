import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClassroomInventoryEntity } from './classroom-inventory.entity';
import { ReportEntity } from './report.entity';

@Entity({ name: 'classrooms' })
export class ClassroomEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 32, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location!: string | null;

  @OneToOne(() => ClassroomInventoryEntity, (i) => i.classroom, {
    cascade: true,
  })
  inventory!: ClassroomInventoryEntity;

  @OneToMany(() => ReportEntity, (r) => r.classroom)
  reports!: ReportEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
