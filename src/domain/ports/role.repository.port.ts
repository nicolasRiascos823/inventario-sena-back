import { RoleCode } from '../enums/role-code.enum';

export interface RoleModel {
  id: string;
  code: RoleCode;
  name: string;
}

export interface RoleRepositoryPort {
  findByCode(code: RoleCode): Promise<RoleModel | null>;
  ensureDefaults(): Promise<void>;
}

export const ROLE_REPOSITORY = Symbol('ROLE_REPOSITORY');
