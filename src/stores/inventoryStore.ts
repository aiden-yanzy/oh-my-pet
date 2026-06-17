import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { InventoryItem, ItemType } from '@/types/inventory';

export const useInventoryStore = defineStore('inventory', () => {
  const items = ref<InventoryItem[]>([]);

  function getCount(type: ItemType): number {
    return items.value.find(i => i.type === type)?.amount ?? 0;
  }

  function addItem(type: ItemType, amount = 1) {
    const existing = items.value.find(i => i.type === type);
    if (existing) {
      existing.amount += amount;
    } else {
      items.value.push({ type, amount });
    }
  }

  function removeItem(type: ItemType, amount = 1): boolean {
    const existing = items.value.find(i => i.type === type);
    if (!existing || existing.amount < amount) return false;
    existing.amount -= amount;
    if (existing.amount <= 0) {
      items.value = items.value.filter(i => i.type !== type);
    }
    return true;
  }

  return { items, getCount, addItem, removeItem };
});
