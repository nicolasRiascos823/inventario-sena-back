import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { UserModel } from '../../domain/models/user.model';
import {
  ROLE_REPOSITORY,
  RoleRepositoryPort,
} from '../../domain/ports/role.repository.port';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserEnabledDto } from './dto/update-user-enabled.dto';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    @Inject(ROLE_REPOSITORY)
    private readonly roles: RoleRepositoryPort,
  ) {}

  async getProfile(userId: string): Promise<UserModel> {
    const user = await this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { passwordHash: _p, ...safe } = user;
    return safe as UserModel;
  }

  async list(): Promise<Omit<UserModel, 'passwordHash'>[]> {
    const rows = await this.users.findAll();
    return rows.map(({ passwordHash: _p, ...u }) => u as UserModel);
  }

  async listInstructors(): Promise<Omit<UserModel, 'passwordHash'>[]> {
    const rows = await this.users.findAll();
    return rows
      .filter((u) => u.roleCode === RoleCode.INSTRUCTOR && u.enabled)
      .map(({ passwordHash: _p, ...u }) => u as UserModel);
  }

  async createInstructor(dto: CreateUserDto): Promise<UserModel> {
    const role = await this.roles.findByCode(RoleCode.INSTRUCTOR);
    if (!role) {
      throw new NotFoundException('Rol instructor no configurado');
    }
    const email = dto.email.toLowerCase();
    if (await this.users.findByEmail(email)) {
      throw new ConflictException('El correo ya está registrado');
    }
    if (await this.users.findByUsername(dto.username)) {
      throw new ConflictException('El nombre de usuario ya existe');
    }
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const created = await this.users.create({
      email,
      username: dto.username,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      roleId: role.id,
    });
    const { passwordHash: _p, ...safe } = created;
    return safe as UserModel;
  }

  async setEnabled(
    actorUserId: string,
    targetUserId: string,
    dto: UpdateUserEnabledDto,
  ): Promise<Omit<UserModel, 'passwordHash'>> {
    if (actorUserId === targetUserId) {
      throw new BadRequestException(
        'No puede cambiar el estado de su propia cuenta desde aquí',
      );
    }
    const target = await this.users.findById(targetUserId);
    if (!target) {
      throw new NotFoundException('Usuario no encontrado');
    }
    await this.users.updateEnabled(targetUserId, dto.enabled);
    const updated = await this.users.findById(targetUserId);
    if (!updated) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const { passwordHash: _p, ...safe } = updated;
    return safe as UserModel;
  }
}
