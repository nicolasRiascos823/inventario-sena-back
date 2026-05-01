import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomInventoryEntity } from './entities/classroom-inventory.entity';
import { FichaEntity } from './entities/ficha.entity';
import { ReportEntity } from './entities/report.entity';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';

export function getTypeOrmConfig(
  configService?: ConfigService,
): TypeOrmModuleOptions {
  const host = configService?.get('DATABASE_HOST') ?? process.env.DATABASE_HOST;
  const port = Number(configService?.get('DATABASE_PORT') ?? process.env.DATABASE_PORT ?? 5432);
  const username =
    configService?.get('DATABASE_USER') ?? process.env.DATABASE_USER;
  const password =
    configService?.get('DATABASE_PASSWORD') ?? process.env.DATABASE_PASSWORD;
  const database =
    configService?.get('DATABASE_NAME') ?? process.env.DATABASE_NAME;

  return {
    type: 'postgres',
    host,
    port,
    username,
    password,
    database,
    entities: [
      RoleEntity,
      UserEntity,
      ClassroomEntity,
      ClassroomInventoryEntity,
      FichaEntity,
      ReportEntity,
    ],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
  };
}
