import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { SeedModule } from './infrastructure/seed/seed.module';
import { getTypeOrmConfig } from './infrastructure/persistence/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { ClassroomsModule } from './modules/classrooms/classrooms.module';
import { FichasModule } from './modules/fichas/fichas.module';
import { HealthModule } from './modules/health/health.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ReportsModule } from './modules/reports/reports.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => getTypeOrmConfig(config),
    }),
    RolesModule,
    UsersModule,
    AuthModule,
    ClassroomsModule,
    FichasModule,
    InventoryModule,
    ReportsModule,
    SeedModule,
    HealthModule,
  ],
  providers: [
    JwtAuthGuard,
    RolesGuard,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
