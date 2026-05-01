import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FichaModel } from '../../../domain/models/ficha.model';
import {
  FICHA_REPOSITORY,
  FichaRepositoryPort,
} from '../../../domain/ports/ficha.repository.port';
import { FichaEntity } from '../entities/ficha.entity';
import { mapFichaEntityToModel } from '../mappers/ficha.mapper';

@Injectable()
export class FichaTypeOrmRepository implements FichaRepositoryPort {
  constructor(
    @InjectRepository(FichaEntity)
    private readonly repo: Repository<FichaEntity>,
  ) {}

  findAll(): Promise<FichaModel[]> {
    return this.repo
      .find({ order: { programaFormacion: 'ASC', numero: 'ASC' } })
      .then((rows) => rows.map(mapFichaEntityToModel));
  }

  async findById(id: string): Promise<FichaModel | null> {
    const row = await this.repo.findOne({ where: { id } });
    return row ? mapFichaEntityToModel(row) : null;
  }

  async create(data: {
    numero: string;
    programaFormacion: string;
  }): Promise<FichaModel> {
    const saved = await this.repo.save(
      this.repo.create({
        numero: data.numero.trim(),
        programaFormacion: data.programaFormacion.trim(),
      }),
    );
    return mapFichaEntityToModel(saved);
  }

  async update(
    id: string,
    data: Partial<{ numero: string; programaFormacion: string }>,
  ): Promise<FichaModel | null> {
    const patch = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    ) as Partial<{ numero: string; programaFormacion: string }>;
    if (Object.keys(patch).length) {
      await this.repo.update({ id }, patch);
    }
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.repo.delete({ id });
    return (res.affected ?? 0) > 0;
  }
}

export const fichaRepositoryProvider = {
  provide: FICHA_REPOSITORY,
  useClass: FichaTypeOrmRepository,
};
