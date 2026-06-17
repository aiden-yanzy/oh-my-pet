<script setup lang="ts">
import { computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { useExploreStore } from '@/stores/exploreStore';
import { useTaskStore } from '@/stores/taskStore';

const petStore = usePetStore();
const exploreStore = useExploreStore();
const taskStore = useTaskStore();

const availableScenes = computed(() => {
  if (!petStore.pet) return [];
  // Use the highest unlocked scene
  const SCENES: { id: string; name: string; unlockLevel: number }[] = [
    { id: 'grassland', name: '草原', unlockLevel: 1 },
    { id: 'forest', name: '森林', unlockLevel: 10 },
    { id: 'mountain', name: '山地', unlockLevel: 15 },
  ];
  return SCENES.filter(s => petStore.pet!.stats.level >= s.unlockLevel);
});

const bestScene = computed(() => {
  const scenes = availableScenes.value;
  return scenes[scenes.length - 1]?.id ?? 'grassland';
});

function handleFeed() {
  petStore.feed();
  taskStore.updateProgress('feed', 1);
}

function handlePlay() {
  petStore.play();
  taskStore.updateProgress('play', 1);
}

function handleExplore() {
  if (exploreStore.isExploring) return;
  exploreStore.startExploration(bestScene.value);
  taskStore.updateProgress('explore', 1);
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Action Buttons Row -->
    <div class="grid grid-cols-5 gap-1.5">
      <!-- Feed -->
      <button
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90"
        :class="petStore.isSleeping || petStore.isSick
          ? 'bg-surface-raised text-muted/40 cursor-not-allowed'
          : 'bg-surface-raised text-body hover:bg-surface-overlay hover:text-heading'"
        :disabled="petStore.isSleeping || petStore.isSick"
        @click="handleFeed"
      >
        <span class="text-xl leading-none">🍖</span>
        <span class="text-[10px] font-medium">喂食</span>
      </button>

      <!-- Play -->
      <button
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90"
        :class="petStore.isSleeping || petStore.isSick
          ? 'bg-surface-raised text-muted/40 cursor-not-allowed'
          : 'bg-surface-raised text-body hover:bg-surface-overlay hover:text-heading'"
        :disabled="petStore.isSleeping || petStore.isSick"
        @click="handlePlay"
      >
        <span class="text-xl leading-none">🎮</span>
        <span class="text-[10px] font-medium">玩耍</span>
      </button>

      <!-- Sleep Toggle -->
      <button
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90"
        :class="petStore.isSick
          ? 'bg-surface-raised text-muted/40 cursor-not-allowed'
          : petStore.isSleeping
            ? 'bg-primary/20 text-primary ring-1 ring-primary/40'
            : 'bg-surface-raised text-body hover:bg-surface-overlay hover:text-heading'"
        :disabled="petStore.isSick"
        @click="petStore.toggleSleep()"
      >
        <span class="text-xl leading-none">{{ petStore.isSleeping ? '🌙' : '😴' }}</span>
        <span class="text-[10px] font-medium">{{ petStore.isSleeping ? '起床' : '睡觉' }}</span>
      </button>

      <!-- Clean -->
      <button
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90"
        :class="petStore.poopCount <= 0
          ? 'bg-surface-raised text-muted/40 cursor-not-allowed'
          : 'bg-surface-raised text-body hover:bg-surface-overlay hover:text-heading'"
        :disabled="petStore.poopCount <= 0"
        @click="petStore.cleanPoop()"
      >
        <span class="text-xl leading-none">🚽</span>
        <span class="text-[10px] font-medium">
          {{ petStore.poopCount > 0 ? `清洁(${petStore.poopCount})` : '清洁' }}
        </span>
      </button>

      <!-- Medicine (shown when sick) -->
      <button
        v-if="petStore.isSick"
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90 bg-danger/20 text-danger ring-1 ring-danger/40"
        @click="petStore.healPet()"
      >
        <span class="text-xl leading-none">💊</span>
        <span class="text-[10px] font-medium">喂药</span>
      </button>

      <!-- Explore (hidden when sick, shown when not sick) -->
      <button
        v-else
        class="flex flex-col items-center gap-0.5 rounded-xl p-2.5 transition-all active:scale-90"
        :class="exploreStore.isExploring || petStore.isSleeping
          ? 'bg-surface-raised text-muted/40 cursor-not-allowed'
          : 'bg-surface-raised text-body hover:bg-surface-overlay hover:text-heading'"
        :disabled="exploreStore.isExploring || petStore.isSleeping"
        @click="handleExplore"
      >
        <span class="text-xl leading-none">🔍</span>
        <span class="text-[10px] font-medium">
          {{ exploreStore.isExploring ? '探索中' : '探索' }}
        </span>
      </button>
    </div>

    <!-- Mood text -->
    <div class="text-center mt-2 text-xs text-muted min-h-[1rem]">
      {{ petStore.moodText }}
    </div>
  </div>
</template>
