import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RoleCode } from '../../domain/enums/role-code.enum';
import { UserModel } from '../../domain/models/user.model';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../domain/ports/user.repository.port';
import { Inject } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';

export interface LoginResult {
  accessToken: string;
  user: {
    id: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    roleCode: RoleCode;
  };
}

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResult> {
    const user = await this.users.findByEmailOrUsernameForAuth(
      dto.emailOrUsername.toLowerCase(),
    );
    const loginFailedMessage =
      'Los datos de acceso no son correctos. Verifique el correo o usuario y la contraseña e intente de nuevo.';
    if (!user?.passwordHash) {
      throw new UnauthorizedException(loginFailedMessage);
    }
    const match = await bcrypt.compare(dto.password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedException(loginFailedMessage);
    }
    return this.buildLoginResult(user);
  }

  private async buildLoginResult(user: UserModel): Promise<LoginResult> {
    const payload = {
      sub: user.id,
      roleCode: user.roleCode,
      email: user.email,
    };
    const accessToken = await this.jwt.signAsync(payload);
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        roleCode: user.roleCode as RoleCode,
      },
    };
  }
}
