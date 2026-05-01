import { RoleCode } from '../../domain/enums/role-code.enum';

export interface AuthUser {
  userId: string;
  roleCode: RoleCode;
  email: string;
}
