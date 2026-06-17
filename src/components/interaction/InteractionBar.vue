<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { useExploreStore } from '@/stores/exploreStore';
import { useTaskStore } from '@/stores/taskStore';
import { FOODS } from '@/data/foods';
import { SCENES } from '@/data/scenes';
import BaseButton from '@/components/BaseButton.vue';

const petStore = usePetStore();
const exploreStore = useExploreStore();
const taskStore = useTaskStore();

const showFeedMenu = ref(false);
const showPlayMenu = ref(false);
const showRestMenu = ref(false);

const gameTypes = [
  { id: 'strength' as const, icon: '💪', label: '力量', cooldown: '30s' },
  { id: 'intelligence' as const, icon: '🧠', label: '智力', cooldown: '30s' },
  { id: 'agility' as const, icon: '🏃', label: '敏捷', cooldown: '30s' },
];

const restDurations = [1, 3, 8];

const availableScenes = computed(() => {
  if (!petStore.pet) return [];
  return SCENES.filter(s => petStore.pet!.stats.level >= s.unlockLevel);
});

function handleFeed(foodType: string) {
  petStore.feed(foodType);
  taskStore.updateProgress('feed', 1);
  showFeedMenu.value = false;
}

function handlePlay(gameType: 'strength' | 'intelligence' | 'agility') {
  petStore.play(gameType);
  taskStore.updateProgress('play', 1);
  showPlayMenu.value = false;
}

function handleRest(hours: number) {
  petStore.rest(hours);
  showRestMenu.value = false;
}

function handleExplore(sceneId: string) {
  exploreStore.startExploration(sceneId);
  taskStore.updateProgress('explore', 1);
}
</script>

<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Action Buttons Row -->
    <div class="grid grid-cols-4 gap-2 mb-3">
      <!-- Feed -->
      <div class="relative">
        <BaseButton
          variant="secondary"
          size="sm"
          class="w-full flex-col gap-0.5 py-2 h-auto"
          :disabled="!petStore.pet"
          @click="showFeedMenu = !showFeedMenu"
        >
          <span class="text-lg">🍖</span>
          <span class="text-[10px]">喂食</span>
        </BaseButton>

        <!-- Feed Popover -->
        <div
          v-if="showFeedMenu"
          class="absolute bottom-full left-0 mb-2 w-48 rounded-xl border border-border bg-surface-raised p-2 shadow-xl z-20"
        >
          <div class="grid grid-cols-2 gap-1.5">
            <button
              v-for="food in FOODS"
              :key="food.id"
              class="flex flex-col items-center gap-0.5 rounded-lg p-2 text-xs text-body hover:bg-surface-overlay hover:text-heading transition-colors"
              @click="handleFeed(food.type)"
            >
              <span class="text-lg">{{ food.icon }}</span>
              <span class="font-medium">{{ food.name }}</span>
              <span class="text-[10px] text-muted">{{ food.description }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Play -->
      <div class="relative">
        <BaseButton
          variant="secondary"
          size="sm"
          class="w-full flex-col gap-0.5 py-2 h-auto"
          :disabled="!petStore.pet"
          @click="showPlayMenu = !showPlayMenu"
        >
          <span class="text-lg">🎮</span>
          <span class="text-[10px]">玩耍</span>
        </BaseButton>

        <!-- Play Popover -->
        <div
          v-if="showPlayMenu"
          class="absolute bottom-full left-0 mb-2 w-44 rounded-xl border border-border bg-surface-raised p-2 shadow-xl z-20"
        >
          <button
            v-for="game in gameTypes"
            :key="game.id"
            class="flex items-center gap-2 w-full rounded-lg p-2.5 text-sm text-body hover:bg-surface-overlay hover:text-heading transition-colors"
            @click="handlePlay(game.id)"
          >
            <span class="text-lg">{{ game.icon }}</span>
            <span class="flex-1 text-left font-medium">{{ game.label }}</span>
            <span class="text-[10px] text-muted">{{ game.cooldown }}</span>
          </button>
        </div>
      </div>

      <!-- Rest -->
      <div class="relative">
        <BaseButton
          variant="secondary"
          size="sm"
          class="w-full flex-col gap-0.5 py-2 h-auto"
          :disabled="!petStore.pet"
          @click="showRestMenu = !showRestMenu"
        >
          <span class="text-lg">😴</span>
          <span class="text-[10px]">休息</span>
        </BaseButton>

        <!-- Rest Popover -->
        <div
          v-if="showRestMenu"
          class="absolute bottom-full left-0 mb-2 w-36 rounded-xl border border-border bg-surface-raised p-2 shadow-xl z-20"
        >
          <button
            v-for="hours in restDurations"
            :key="hours"
            class="flex items-center justify-center w-full rounded-lg p-2.5 text-sm text-body hover:bg-surface-overlay hover:text-heading transition-colors"
            @click="handleRest(hours)"
          >
            {{ hours }}小时
          </button>
        </div>
      </div>

      <!-- Explore -->
      <div class="relative">
        <BaseButton
          variant="secondary"
          size="sm"
          class="w-full flex-col gap-0.5 py-2 h-auto"
          :disabled="!petStore.pet || exploreStore.isExploring"
          @click="handleExplore(availableScenes[0]?.id ?? 'grassland')"
        >
          <span class="text-lg">🔍</span>
          <span class="text-[10px]">
            {{ exploreStore.isExploring ? '探索中...' : '探索' }}
          </span>
        </BaseButton>
      </div>
    </div>

    <!-- Explore Scenes (when multiple available) -->
    <div v-if="availableScenes.length > 1" class="flex gap-1.5 mb-2 overflow-x-auto pb-1">
      <button
        v-for="scene in availableScenes"
        :key="scene.id"
        class="flex-shrink-0 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs text-body hover:border-border-hover hover:text-heading transition-colors"
        :disabled="exploreStore.isExploring"
        @click="handleExplore(scene.id)"
      >
        {{ scene.name }}
      </button>
    </div>

    <!-- Overlay click to close popovers -->
    <div
      v-if="showFeedMenu || showPlayMenu || showRestMenu"
      class="fixed inset-0 z-10"
      @click="showFeedMenu = false; showPlayMenu = false; showRestMenu = false"
    />
  </div>
</template>
