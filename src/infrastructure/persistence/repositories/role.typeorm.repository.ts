import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleCode } from '../../../domain/enums/role-code.enum';
import {
  ROLE_REPOSITORY,
  RoleModel,
  RoleRepositoryPort,
} from '../../../domain/ports/role.repository.port';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class RoleTypeOrmRepository implements RoleRepositoryPort, OnModuleInit {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly repo: Repository<RoleEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureDefaults();
  }

  async findByCode(code: RoleCode): Promise<RoleModel | null> {
    const row = await this.repo.findOne({ where: { code } });
    if (!row) return null;
    return { id: row.id, code: row.code as RoleCode, name: row.name };
  }

  async ensureDefaults(): Promise<void> {
    const defaults: { code: RoleCode; name: string }[] = [
      { code: RoleCode.ADMIN, name: 'Administrador' },
      { code: RoleCode.INSTRUCTOR, name: 'Instructor' },
    ];
    for (const d of defaults) {
      const exists = await this.repo.exist({ where: { code: d.code } });
      if (!exists) {
        await this.repo.save(this.repo.create(d));
      }
    }
  }
}

export const roleRepositoryProvider = {
  provide: ROLE_REPOSITORY,
  useClass: RoleTypeOrmRepository,
};
