import { UserModel } from '../models/user.model';

export interface UserRepositoryPort {
  findById(id: string): Promise<UserModel | null>;
  findByEmail(email: string): Promise<UserModel | null>;
  findByUsername(username: string): Promise<UserModel | null>;
  findByEmailOrUsername(emailOrUsername: string): Promise<UserModel | null>;
  findByEmailOrUsernameForAuth(
    emailOrUsername: string,
  ): Promise<UserModel | null>;
  findAll(): Promise<UserModel[]>;
  create(data: {
    email: string;
    username: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    roleId: string;
  }): Promise<UserModel>;
  updatePassword(id: string, passwordHash: string): Promise<void>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');
