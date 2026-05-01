import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { ClassroomEntity } from './entities/classroom.entity';
import { ClassroomInventoryEntity } from './entities/classroom-inventory.entity';
import { FichaEntity } from './entities/ficha.entity';
import { ReportEntity } from './entities/report.entity';
import { RoleEntity } from './entities/role.entity';
import { UserEntity } from './entities/user.entity';

dotenv.config({ path: '.env' });

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'postgres',
  password: process.env.DATABASE_PASSWORD ?? 'postgres',
  database: process.env.DATABASE_NAME ?? 'inventario_sena',
  entities: [
    RoleEntity,
    UserEntity,
    ClassroomEntity,
    ClassroomInventoryEntity,
    FichaEntity,
    ReportEntity,
  ],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
});
