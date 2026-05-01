import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { USER_DISABLED_MESSAGE } from '../../../common/constants/auth.messages';
import { AuthUser } from '../../../common/interfaces/auth-user.interface';
import { RoleCode } from '../../../domain/enums/role-code.enum';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../../../domain/ports/user.repository.port';

export interface JwtPayload {
  sub: string;
  roleCode: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUser> {
    const user = await this.users.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (!user.enabled) {
      throw new UnauthorizedException(USER_DISABLED_MESSAGE);
    }
    return {
      userId: user.id,
      roleCode: user.roleCode as RoleCode,
      email: user.email,
    };
  }
}
