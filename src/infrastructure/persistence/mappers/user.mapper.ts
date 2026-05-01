import { UserModel } from '../../../domain/models/user.model';
import { UserEntity } from '../entities/user.entity';

export function mapUserEntityToModel(entity: UserEntity): UserModel {
  return {
    id: entity.id,
    email: entity.email,
    username: entity.username,
    passwordHash: entity.passwordHash,
    firstName: entity.firstName,
    lastName: entity.lastName,
    roleId: entity.roleId,
    roleCode: entity.role.code,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
