import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportEntity } from '../../infrastructure/persistence/entities/report.entity';
import { reportRepositoryProvider } from '../../infrastructure/persistence/repositories/report.typeorm.repository';
import { ClassroomsModule } from '../classrooms/classrooms.module';
import { FichasModule } from '../fichas/fichas.module';
import { UsersModule } from '../users/users.module';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReportEntity]),
    ClassroomsModule,
    FichasModule,
    UsersModule,
  ],
  controllers: [ReportsController],
  providers: [ReportsService, reportRepositoryProvider],
})
export class ReportsModule {}
