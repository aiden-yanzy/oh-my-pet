import type { ItemType } from '@/types/inventory';

export interface FoodDef {
  id: string;
  name: string;
  type: 'meat' | 'vegetable' | 'snack' | 'special';
  description: string;
  icon: string;
  itemType: ItemType;
}

export const FOODS: FoodDef[] = [
  { id: 'steak', name: '🥩 牛排', type: 'meat', description: '增加力量', icon: '🥩', itemType: 'food' },
  { id: 'chicken', name: '🍗 鸡肉', type: 'meat', description: '增加力量', icon: '🍗', itemType: 'food' },
  { id: 'apple', name: '🍎 苹果', type: 'vegetable', description: '增加智力', icon: '🍎', itemType: 'food' },
  { id: 'carrot', name: '🥕 胡萝卜', type: 'vegetable', description: '增加智力', icon: '🥕', itemType: 'food' },
  { id: 'cookie', name: '🍪 饼干', type: 'snack', description: '增加敏捷', icon: '🍪', itemType: 'food' },
  { id: 'candy', name: '🍬 糖果', type: 'snack', description: '增加敏捷', icon: '🍬', itemType: 'food' },
];

export const FOOD_EFFECTS: Record<string, { health: number; happiness?: number; stat?: { type: string; value: number }; experience: number }> = {
  meat: { health: 20, stat: { type: 'strength', value: 3 }, experience: 5 },
  vegetable: { health: 15, stat: { type: 'intelligence', value: 3 }, experience: 5 },
  snack: { health: 5, happiness: 10, stat: { type: 'agility', value: 2 }, experience: 3 },
  special: { health: 30, experience: 10 },
};
