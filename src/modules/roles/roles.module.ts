import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from '../../infrastructure/persistence/entities/role.entity';
import { roleRepositoryProvider } from '../../infrastructure/persistence/repositories/role.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RoleEntity])],
  providers: [roleRepositoryProvider],
  exports: [roleRepositoryProvider],
})
export class RolesModule {}
