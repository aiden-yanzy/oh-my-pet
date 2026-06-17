export type ItemType = 'food' | 'toy_strength' | 'toy_intelligence' | 'toy_agility';

export interface InventoryItem {
  type: ItemType;
  amount: number;
}

export interface Inventory {
  items: InventoryItem[];
}
