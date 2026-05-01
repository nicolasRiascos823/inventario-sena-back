import { ClassroomModel } from '../../../domain/models/classroom.model';
import { emptyInventoryCounts } from '../../../domain/value-objects/inventory-counts.vo';
import { ClassroomEntity } from '../entities/classroom.entity';

export function mapClassroomEntityToModel(entity: ClassroomEntity): ClassroomModel {
  const inv = entity.inventory;
  return {
    id: entity.id,
    code: entity.code,
    name: entity.name,
    location: entity.location,
    baseInventory: inv
      ? {
          laptops: inv.laptops,
          mouses: inv.mouses,
          chargers: inv.chargers,
          tables: inv.tables,
          chairs: inv.chairs,
        }
      : emptyInventoryCounts(),
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
