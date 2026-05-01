import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../infrastructure/persistence/entities/user.entity';
import { userRepositoryProvider } from '../../infrastructure/persistence/repositories/user.typeorm.repository';
import { RolesModule } from '../roles/roles.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), RolesModule],
  controllers: [UsersController],
  providers: [UsersService, userRepositoryProvider],
  exports: [UsersService, userRepositoryProvider],
})
export class UsersModule {}
