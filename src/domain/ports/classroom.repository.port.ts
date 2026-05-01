import { ClassroomModel } from '../models/classroom.model';
import { InventoryCounts } from '../value-objects/inventory-counts.vo';

export interface ClassroomRepositoryPort {
  findAll(): Promise<ClassroomModel[]>;
  findById(id: string): Promise<ClassroomModel | null>;
  findByCode(code: string): Promise<ClassroomModel | null>;
  create(data: {
    code: string;
    name: string;
    location?: string | null;
    initialInventory?: InventoryCounts;
  }): Promise<ClassroomModel>;
  update(
    id: string,
    data: Partial<{ name: string; location: string | null }>,
  ): Promise<ClassroomModel | null>;
  delete(id: string): Promise<boolean>;
  updateBaseInventory(
    classroomId: string,
    counts: InventoryCounts,
  ): Promise<ClassroomModel | null>;
}

export const CLASSROOM_REPOSITORY = Symbol('CLASSROOM_REPOSITORY');
