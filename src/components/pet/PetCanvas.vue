<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { usePetRenderer } from '@/composables/usePetRenderer';

const petStore = usePetStore();
const canvasContainer = ref<HTMLDivElement | null>(null);

const petRef = computed(() => petStore.pet);
const moodRef = computed(() => petStore.moodAnim);
const poopRef = computed(() => petStore.poopCount);
const sleepRef = computed(() => petStore.isSleeping);
const sickRef = computed(() => petStore.isSick);

const { init, destroy } = usePetRenderer(
  canvasContainer,
  petRef,
  moodRef,
  poopRef,
  sleepRef,
  sickRef,
);

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
    <div class="flex items-center gap-2 mb-1">
      <span class="text-sm font-medium text-muted">Lv.{{ petStore.pet.stats.level }}</span>
      <span class="text-lg font-bold text-heading">{{ petStore.pet.name }}</span>
    </div>

    <!-- Pixi Canvas Container -->
    <div
      ref="canvasContainer"
      class="w-[280px] h-[220px] flex items-center justify-center"
    />

    <!-- Compact Status (Tamagotchi-style) -->
    <div class="w-[280px] flex items-center gap-3 px-2 mb-2">
      <!-- Happiness -->
      <div class="flex items-center gap-1 flex-1">
        <span class="text-sm">😊</span>
        <div class="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="happinessBar > 60 ? 'bg-success' : happinessBar > 30 ? 'bg-warning' : 'bg-danger'"
            :style="{ width: `${happinessBar}%` }"
          />
        </div>
      </div>
      <!-- Health -->
      <div class="flex items-center gap-1 flex-1">
        <span class="text-sm">❤️</span>
        <div class="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
          <div
            class="h-full rounded-full transition-all duration-500"
            :class="healthBar > 60 ? 'bg-success' : healthBar > 30 ? 'bg-warning' : 'bg-danger'"
            :style="{ width: `${healthBar}%` }"
          />
        </div>
      </div>
      <!-- XP -->
      <div class="flex items-center gap-1 flex-1">
        <span class="text-xs text-muted">EXP</span>
        <span class="text-[10px] text-muted">{{ Math.round(petStore.pet.stats.experience) }}/{{ petStore.experienceToNext }}</span>
      </div>
    </div>
  </div>

  <!-- Empty state -->
  <div v-else class="flex flex-col items-center justify-center w-[280px] h-[220px] text-muted">
    <span class="text-4xl mb-2">🐣</span>
    <p class="text-sm">还没有宠物...</p>
  </div>
</template>
