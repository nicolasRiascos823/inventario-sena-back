import { SetMetadata } from '@nestjs/common';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { ROLES_KEY } from '../constants/metadata.keys';

export const Roles = (...roles: RoleCode[]) => SetMetadata(ROLES_KEY, roles);
