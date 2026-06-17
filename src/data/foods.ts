import type { FoodId } from '@/types/inventory';

export interface FoodDef {
  id: FoodId;
  name: string;
  type: 'meat' | 'vegetable' | 'snack' | 'special';
  description: string;
  icon: string;
  /** Full effect details shown in the food picker */
  effectDesc: string;
}

export const FOODS: FoodDef[] = [
  { id: 'steak', name: '🥩 牛排', type: 'meat', description: '增加力量', icon: '🥩',
    effectDesc: '❤️+20 🏋️+3 EXP+5' },
  { id: 'chicken', name: '🍗 鸡肉', type: 'meat', description: '增加力量', icon: '🍗',
    effectDesc: '❤️+20 🏋️+3 EXP+5' },
  { id: 'apple', name: '🍎 苹果', type: 'vegetable', description: '增加智力', icon: '🍎',
    effectDesc: '❤️+15 🧠+3 EXP+5' },
  { id: 'carrot', name: '🥕 胡萝卜', type: 'vegetable', description: '增加智力', icon: '🥕',
    effectDesc: '❤️+15 🧠+3 EXP+5' },
  { id: 'cookie', name: '🍪 饼干', type: 'snack', description: '增加敏捷', icon: '🍪',
    effectDesc: '❤️+5 😊+10 ⚡+2 EXP+3' },
  { id: 'candy', name: '🍬 糖果', type: 'snack', description: '增加敏捷', icon: '🍬',
    effectDesc: '❤️+5 😊+10 ⚡+2 EXP+3' },
];

/**
 * FOOD_EFFECTS indexed by food ID (not just type).
 * Falls back to type-based effects for backward compatibility.
 */
export const FOOD_EFFECTS_BY_ID: Record<FoodId, { health: number; happiness?: number; stat?: { type: string; value: number }; experience: number }> = {
  steak: { health: 20, stat: { type: 'strength', value: 3 }, experience: 5 },
  chicken: { health: 20, stat: { type: 'strength', value: 3 }, experience: 5 },
  apple: { health: 15, stat: { type: 'intelligence', value: 3 }, experience: 5 },
  carrot: { health: 15, stat: { type: 'intelligence', value: 3 }, experience: 5 },
  cookie: { health: 5, happiness: 10, stat: { type: 'agility', value: 2 }, experience: 3 },
  candy: { health: 5, happiness: 10, stat: { type: 'agility', value: 2 }, experience: 3 },
};

/**
 * Legacy FOOD_EFFECTS indexed by food type.
 * Keep for backward compat.
 */
export const FOOD_EFFECTS: Record<string, { health: number; happiness?: number; stat?: { type: string; value: number }; experience: number }> = {
  meat: { health: 20, stat: { type: 'strength', value: 3 }, experience: 5 },
  vegetable: { health: 15, stat: { type: 'intelligence', value: 3 }, experience: 5 },
  snack: { health: 5, happiness: 10, stat: { type: 'agility', value: 2 }, experience: 3 },
  special: { health: 30, experience: 10 },
};
