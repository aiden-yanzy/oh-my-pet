export type ItemType = 'food' | 'toy_strength' | 'toy_intelligence' | 'toy_agility';

export type FoodId = 'steak' | 'chicken' | 'apple' | 'carrot' | 'cookie' | 'candy';

export interface InventoryItem {
  type: ItemType;
  amount: number;
}

export interface Inventory {
  items: InventoryItem[];
}

/** Per-food inventory tracked by food ID → count */
export type FoodInventory = Record<FoodId, number>;
