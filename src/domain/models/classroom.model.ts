import { InventoryCounts } from '../value-objects/inventory-counts.vo';

export interface ClassroomModel {
  id: string;
  code: string;
  name: string;
  location: string | null;
  baseInventory: InventoryCounts;
  createdAt: Date;
  updatedAt: Date;
}
