import { InventoryCounts } from '../../domain/value-objects/inventory-counts.vo';

export type InventoryItemKey = keyof InventoryCounts;

export interface InventoryComparisonRow {
  key: InventoryItemKey;
  label: string;
  base: number;
  reported: number;
  matches: boolean;
  delta: number;
}

const LABELS: Record<InventoryItemKey, string> = {
  laptops: 'Portátiles',
  mouses: 'Mouses',
  chargers: 'Cargadores',
  tables: 'Mesas',
  chairs: 'Sillas',
};

export function compareInventoryToBase(
  base: InventoryCounts,
  reported: InventoryCounts,
): { rows: InventoryComparisonRow[]; hasInconsistency: boolean } {
  const keys: InventoryItemKey[] = [
    'laptops',
    'mouses',
    'chargers',
    'tables',
    'chairs',
  ];
  const rows = keys.map((key) => {
    const b = base[key];
    const r = reported[key];
    return {
      key,
      label: LABELS[key],
      base: b,
      reported: r,
      matches: b === r,
      delta: r - b,
    };
  });
  return {
    rows,
    hasInconsistency: rows.some((row) => !row.matches),
  };
}
