import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomInventoryEntity } from '../../infrastructure/persistence/entities/classroom-inventory.entity';
import { ClassroomEntity } from '../../infrastructure/persistence/entities/classroom.entity';
import { classroomRepositoryProvider } from '../../infrastructure/persistence/repositories/classroom.typeorm.repository';
import { ClassroomsController } from './classrooms.controller';
import { ClassroomsService } from './classrooms.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ClassroomEntity, ClassroomInventoryEntity]),
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, classroomRepositoryProvider],
  exports: [ClassroomsService, classroomRepositoryProvider],
})
export class ClassroomsModule {}
