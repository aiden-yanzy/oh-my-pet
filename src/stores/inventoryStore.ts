import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { FoodId, FoodInventory } from '@/types/inventory';
import { storageService } from '@/services/storageService';

const DEFAULT_INVENTORY: FoodInventory = {
  steak: 5,
  chicken: 5,
  apple: 5,
  carrot: 5,
  cookie: 5,
  candy: 5,
};

export const useInventoryStore = defineStore('inventory', () => {
  const food = ref<FoodInventory>({ ...DEFAULT_INVENTORY });

  async function init() {
    await storageService.init();
    // Load inventory from storage — use localStorage fallback key
    const raw = localStorage.getItem('oh-my-pet:foodInventory');
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as FoodInventory;
        // Merge: keep default keys, override with saved values
        food.value = { ...DEFAULT_INVENTORY, ...parsed };
      } catch {
        // keep defaults
      }
    }
  }

  function save() {
    localStorage.setItem('oh-my-pet:foodInventory', JSON.stringify(food.value));
  }

  /** Check if a food item is available */
  function hasFood(foodId: FoodId): boolean {
    return (food.value[foodId] ?? 0) > 0;
  }

  /** Consume one unit of food. Returns false if none left. */
  function consume(foodId: FoodId): boolean {
    if (!hasFood(foodId)) return false;
    food.value[foodId]--;
    save();
    return true;
  }

  /** Add food to inventory */
  function add(foodId: FoodId, count: number = 1) {
    food.value[foodId] = (food.value[foodId] ?? 0) + count;
    save();
  }

  /** Add random foods (from exploration reward) */
  function addRandom(count: number = 1) {
    const ids: FoodId[] = ['steak', 'chicken', 'apple', 'carrot', 'cookie', 'candy'];
    for (let i = 0; i < count; i++) {
      const pick = ids[Math.floor(Math.random() * ids.length)]!;
      add(pick);
    }
  }

  /** Total food items in inventory */
  function totalFood(): number {
    let total = 0;
    const f = food.value;
    for (const key of Object.keys(f) as FoodId[]) {
      total += f[key] ?? 0;
    }
    return total;
  }

  return { food, init, save, hasFood, consume, add, addRandom, totalFood };
});
