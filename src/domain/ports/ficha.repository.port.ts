import { FichaModel } from '../models/ficha.model';

export interface FichaRepositoryPort {
  findAll(): Promise<FichaModel[]>;
  findById(id: string): Promise<FichaModel | null>;
  create(data: { numero: string; programaFormacion: string }): Promise<FichaModel>;
  update(
    id: string,
    data: Partial<{ numero: string; programaFormacion: string }>,
  ): Promise<FichaModel | null>;
  delete(id: string): Promise<boolean>;
}

export const FICHA_REPOSITORY = Symbol('FICHA_REPOSITORY');
