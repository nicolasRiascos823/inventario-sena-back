import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from '../../../domain/models/user.model';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../domain/ports/user.repository.port';
import { UserEntity } from '../entities/user.entity';
import { mapUserEntityToModel } from '../mappers/user.mapper';

@Injectable()
export class UserTypeOrmRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  async findById(id: string): Promise<UserModel | null> {
    const row = await this.repo.findOne({
      where: { id },
      relations: { role: true },
    });
    return row ? mapUserEntityToModel(row) : null;
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    const row = await this.repo.findOne({
      where: { email: email.toLowerCase() },
      relations: { role: true },
    });
    return row ? mapUserEntityToModel(row) : null;
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    const row = await this.repo.findOne({
      where: { username },
      relations: { role: true },
    });
    return row ? mapUserEntityToModel(row) : null;
  }

  async findByEmailOrUsername(
    emailOrUsername: string,
  ): Promise<UserModel | null> {
    const q = emailOrUsername.trim();
    const lower = q.toLowerCase();
    const row = await this.repo.findOne({
      where: [{ email: lower }, { username: q }],
      relations: { role: true },
    });
    return row ? mapUserEntityToModel(row) : null;
  }

  async findByEmailOrUsernameForAuth(
    emailOrUsername: string,
  ): Promise<UserModel | null> {
    const q = emailOrUsername.trim();
    const lower = q.toLowerCase();
    const row = await this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .leftJoinAndSelect('u.role', 'role')
      .where('u.email = :email OR u.username = :username', {
        email: lower,
        username: q,
      })
      .getOne();
    return row ? mapUserEntityToModel(row) : null;
  }

  async findAll(): Promise<UserModel[]> {
    const rows = await this.repo.find({
      relations: { role: true },
      order: { createdAt: 'DESC' },
    });
    return rows.map(mapUserEntityToModel);
  }

  async create(data: {
    email: string;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleId: string;
  }): Promise<UserModel> {
    const entity = this.repo.create({
      email: data.email.toLowerCase(),
      username: data.username,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      roleId: data.roleId,
      enabled: true,
    });
    const saved = await this.repo.save(entity);
    const withRole = await this.repo.findOneOrFail({
      where: { id: saved.id },
      relations: { role: true },
    });
    return mapUserEntityToModel(withRole);
  }

  async updatePassword(id: string, passwordHash: string): Promise<void> {
    await this.repo.update({ id }, { passwordHash });
  }

  async updateEnabled(id: string, enabled: boolean): Promise<void> {
    await this.repo.update({ id }, { enabled });
  }
}

export const userRepositoryProvider = {
  provide: USER_REPOSITORY,
  useClass: UserTypeOrmRepository,
};
