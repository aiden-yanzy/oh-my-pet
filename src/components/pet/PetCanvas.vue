<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { usePetRenderer } from '@/composables/usePetRenderer';

const petStore = usePetStore();
const canvasContainer = ref<HTMLDivElement | null>(null);
const { init, destroy } = usePetRenderer(canvasContainer, computed(() => petStore.pet));

const happinessBar = computed(() => {
  if (!petStore.pet) return 0;
  return Math.round(petStore.pet.stats.happiness);
});

const healthBar = computed(() => {
  if (!petStore.pet) return 0;
  return Math.round(petStore.pet.stats.health);
});

onMounted(() => {
  init();
});
onUnmounted(() => {
  destroy();
});
</script>

<template>
  <div v-if="petStore.pet" class="flex flex-col items-center w-full">
    <!-- Pet Name and Level -->
    <div class="flex items-center gap-2 mb-2">
      <span class="text-sm font-medium text-muted">Lv.{{ petStore.pet.stats.level }}</span>
      <span class="text-lg font-bold text-heading">{{ petStore.pet.name }}</span>
    </div>

    <!-- Pixi Canvas Container -->
    <div
      ref="canvasContainer"
      class="w-[280px] h-[280px] flex items-center justify-center"
    />

    <!-- XP Bar -->
    <div class="w-[280px] mb-3">
      <div class="flex justify-between text-xs text-muted mb-1">
        <span>EXP</span>
        <span>{{ Math.round(petStore.pet.stats.experience) }}/{{ petStore.experienceToNext }}</span>
      </div>
      <div class="h-1.5 w-full rounded-full bg-surface-raised overflow-hidden">
        <div
          class="h-full rounded-full bg-primary transition-all duration-500"
          :style="{ width: `${petStore.expProgress * 100}%` }"
        />
      </div>
    </div>

    <!-- Stat Bars -->
    <div class="w-[280px] space-y-2">
      <!-- Happiness -->
      <div class="flex items-center gap-2">
        <span class="text-sm">😊</span>
        <div class="flex-1 h-3 rounded-full bg-surface-raised overflow-hidden">
          <div
            class="h-full rounded-full bg-success transition-all duration-500"
            :style="{ width: `${happinessBar}%` }"
          />
        </div>
        <span class="text-xs text-muted w-8 text-right">{{ happinessBar }}</span>
      </div>
      <!-- Health -->
      <div class="flex items-center gap-2">
        <span class="text-sm">❤️</span>
        <div class="flex-1 h-3 rounded-full bg-surface-raised overflow-hidden">
          <div
            class="h-full rounded-full bg-danger transition-all duration-500"
            :style="{ width: `${healthBar}%` }"
          />
        </div>
        <span class="text-xs text-muted w-8 text-right">{{ healthBar }}</span>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div v-else class="flex flex-col items-center justify-center w-[280px] h-[280px] text-muted">
    <span class="text-4xl mb-2">🐣</span>
    <p class="text-sm">还没有宠物...</p>
  </div>
</template>
