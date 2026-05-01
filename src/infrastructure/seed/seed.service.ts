import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { RoleEntity } from '../persistence/entities/role.entity';
import { UserEntity } from '../persistence/entities/user.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly config: ConfigService,
    @InjectRepository(UserEntity)
    private readonly users: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roles: Repository<RoleEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const email =
      this.config.get<string>('SEED_ADMIN_EMAIL') ??
      'admin@senainventario.local';
    const password =
      this.config.get<string>('SEED_ADMIN_PASSWORD') ?? 'Admin123!';
    const exists = await this.users.exist({ where: { email: email.toLowerCase() } });
    if (exists) {
      return;
    }
    const adminRole = await this.roles.findOne({
      where: { code: RoleCode.ADMIN },
    });
    if (!adminRole) {
      this.logger.warn('Rol ADMIN no encontrado; omitiendo seed de usuario');
      return;
    }
    const hash = await bcrypt.hash(password, 10);
    await this.users.save(
      this.users.create({
        email: email.toLowerCase(),
        username: this.config.get<string>('SEED_ADMIN_USERNAME') ?? 'admin',
        passwordHash: hash,
        firstName: 'Administrador',
        lastName: 'Sistema',
        roleId: adminRole.id,
        enabled: true,
      }),
    );
    this.logger.log(`Usuario administrador creado: ${email}`);
  }
}
