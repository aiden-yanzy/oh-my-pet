<script setup lang="ts">
import { onMounted } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { useInventoryStore } from '@/stores/inventoryStore';
import { FOODS, FOOD_EFFECTS_BY_ID } from '@/data/foods';
import type { FoodId } from '@/types/inventory';

const emit = defineEmits<{ close: [] }>();
const petStore = usePetStore();
const invStore = useInventoryStore();

onMounted(async () => {
  await invStore.init();
});

const categories = [
  { id: 'meat' as const, label: '🥩 肉类', icon: '🥩' },
  { id: 'vegetable' as const, label: '🥗 蔬菜', icon: '🥗' },
  { id: 'snack' as const, label: '🍪 零食', icon: '🍪' },
];

function handleFeed(foodId: string) {
  petStore.feed(foodId);
  emit('close');
}

function getCount(foodId: FoodId): number {
  return invStore.food[foodId] ?? 0;
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-end sm:items-center justify-center">
    <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

    <div
      class="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface border border-border
             max-h-[75vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-bold text-heading">🍽️ 喂食</h2>
          <span class="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded-full">
            库存 {{ invStore.totalFood() }} 件
          </span>
        </div>
        <button
          class="rounded-lg p-1.5 text-muted hover:text-heading hover:bg-surface-overlay transition-colors"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-5">
        <!-- Pet stats preview -->
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-raised text-xs text-muted">
          <span>❤️ {{ petStore.pet?.stats.health ?? 0 }}</span>
          <span>😊 {{ petStore.pet?.stats.happiness ?? 0 }}</span>
          <span class="text-muted/40">|</span>
          <span>🏋️ {{ petStore.pet?.stats.strength ?? 0 }}</span>
          <span>🧠 {{ petStore.pet?.stats.intelligence ?? 0 }}</span>
          <span>⚡ {{ petStore.pet?.stats.agility ?? 0 }}</span>
        </div>

        <!-- Categories -->
        <div v-for="cat in categories" :key="cat.id" class="space-y-2">
          <h3 class="text-xs font-semibold text-muted uppercase tracking-wider">{{ cat.label }}</h3>
          <div class="space-y-1.5">
            <button
              v-for="food in FOODS.filter(f => f.type === cat.id)"
              :key="food.id"
              :disabled="getCount(food.id) <= 0"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              :class="getCount(food.id) > 0
                ? 'bg-surface-raised hover:bg-surface-overlay active:scale-[0.97]'
                : 'bg-surface-raised text-muted/40 cursor-not-allowed opacity-50'"
              @click="handleFeed(food.id)"
            >
              <span class="text-xl shrink-0">{{ food.icon }}</span>
              <div class="flex-1 min-w-0 text-left">
                <p class="text-sm font-medium" :class="getCount(food.id) > 0 ? 'text-heading' : 'text-muted/60'">
                  {{ food.name }}
                </p>
                <p class="text-[10px]" :class="getCount(food.id) > 0 ? 'text-muted' : 'text-muted/40'">
                  {{ FOOD_EFFECTS_BY_ID[food.id] ? food.effectDesc : '' }}
                </p>
              </div>
              <div class="text-right shrink-0">
                <span
                  class="text-xs font-bold"
                  :class="getCount(food.id) > 0 ? 'text-primary' : 'text-muted/40'"
                >
                  ×{{ getCount(food.id) }}
                </span>
              </div>
            </button>
          </div>
        </div>

        <!-- Empty fallback -->
        <p
          v-if="invStore.totalFood() <= 0"
          class="text-xs text-muted/60 text-center py-8"
        >
          背包里没有食物了！去探索获取吧 🔍
        </p>
      </div>
    </div>
  </div>
</template>
