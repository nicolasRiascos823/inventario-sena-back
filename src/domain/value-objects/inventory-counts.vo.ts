export interface InventoryCounts {
  laptops: number;
  mouses: number;
  chargers: number;
  tables: number;
  chairs: number;
}

export function emptyInventoryCounts(): InventoryCounts {
  return {
    laptops: 0,
    mouses: 0,
    chargers: 0,
    tables: 0,
    chairs: 0,
  };
}
