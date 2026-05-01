import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { FichaModel } from '../../domain/models/ficha.model';
import {
  FICHA_REPOSITORY,
  FichaRepositoryPort,
} from '../../domain/ports/ficha.repository.port';
import { CreateFichaDto } from './dto/create-ficha.dto';
import { UpdateFichaDto } from './dto/update-ficha.dto';

@Injectable()
export class FichasService {
  constructor(
    @Inject(FICHA_REPOSITORY)
    private readonly fichas: FichaRepositoryPort,
  ) {}

  list(): Promise<FichaModel[]> {
    return this.fichas.findAll();
  }

  async create(dto: CreateFichaDto): Promise<FichaModel> {
    return this.fichas.create({
      numero: dto.numero,
      programaFormacion: dto.programaFormacion,
    });
  }

  async update(id: string, dto: UpdateFichaDto): Promise<FichaModel> {
    const updated = await this.fichas.update(id, {
      numero: dto.numero,
      programaFormacion: dto.programaFormacion,
    });
    if (!updated) {
      throw new NotFoundException('Ficha no encontrada');
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const ok = await this.fichas.delete(id);
    if (!ok) {
      throw new NotFoundException('Ficha no encontrada');
    }
  }
}
