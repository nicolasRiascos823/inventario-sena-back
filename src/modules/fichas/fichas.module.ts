import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FichaEntity } from '../../infrastructure/persistence/entities/ficha.entity';
import { fichaRepositoryProvider } from '../../infrastructure/persistence/repositories/ficha.typeorm.repository';
import { FichasController } from './fichas.controller';
import { FichasService } from './fichas.service';

@Module({
  imports: [TypeOrmModule.forFeature([FichaEntity])],
  controllers: [FichasController],
  providers: [FichasService, fichaRepositoryProvider],
  exports: [fichaRepositoryProvider],
})
export class FichasModule {}
