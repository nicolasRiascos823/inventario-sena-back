import { FichaModel } from '../../../domain/models/ficha.model';
import { FichaEntity } from '../entities/ficha.entity';

export function mapFichaEntityToModel(entity: FichaEntity): FichaModel {
  return {
    id: entity.id,
    numero: entity.numero,
    programaFormacion: entity.programaFormacion,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
