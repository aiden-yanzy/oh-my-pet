<script setup lang="ts">
import { ref } from 'vue';
import { useExploreStore } from '@/stores/exploreStore';
import BaseBadge from '@/components/BaseBadge.vue';

const exploreStore = useExploreStore();

const emit = defineEmits<{
  close: []
}>();

const expandedLogId = ref<string | null>(null);

function toggleExpand(logId: string) {
  if (expandedLogId.value === logId) {
    expandedLogId.value = null;
  } else {
    expandedLogId.value = logId;
    exploreStore.markAsViewed(logId);
  }
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const hours = d.getHours().toString().padStart(2, '0');
  const mins = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
}

function formatDuration(start: number, end: number): string {
  const mins = Math.round((end - start) / 60000);
  if (mins < 60) return `${mins}分钟`;
  return `${Math.floor(mins / 60)}小时${mins % 60}分钟`;
}

const sceneNames: Record<string, string> = {
  grassland: '草原', forest: '森林', mountain: '山地',
};
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

    <!-- Panel -->
    <div class="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface border border-border max-h-[70vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 class="text-lg font-bold text-heading">探索记录</h2>
        <button
          class="rounded-lg p-1.5 text-muted hover:text-heading hover:bg-surface-overlay transition-colors"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Logs -->
      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="exploreStore.logs.length === 0" class="flex flex-col items-center justify-center py-12 text-muted">
          <span class="text-4xl mb-3">🗺️</span>
          <p class="text-sm">还没有探索记录</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="log in exploreStore.logs"
            :key="log.id"
            class="rounded-lg border border-border overflow-hidden transition-colors cursor-pointer"
            :class="expandedLogId === log.id ? 'border-primary' : 'hover:bg-surface-raised'"
            @click="toggleExpand(log.id)"
          >
            <!-- Log Header -->
            <div class="flex items-center gap-3 p-3">
              <div class="flex-shrink-0 w-2 h-2 rounded-full"
                :class="log.viewed ? 'bg-muted' : 'bg-primary'"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-heading">
                    {{ sceneNames[log.sceneId] ?? log.sceneId }}
                  </span>
                  <BaseBadge v-if="!log.viewed" variant="primary">NEW</BaseBadge>
                </div>
                <div class="text-xs text-muted mt-0.5">
                  {{ formatTime(log.startTime) }} ~ {{ formatTime(log.endTime) }}
                  ({{ formatDuration(log.startTime, log.endTime) }})
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="size-4 text-muted transition-transform"
                :class="expandedLogId === log.id ? 'rotate-180' : ''"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </div>

            <!-- Expanded Events -->
            <div v-if="expandedLogId === log.id" class="border-t border-border px-3 py-2 space-y-2">
              <div v-for="evt in log.events" :key="evt.id" class="rounded-lg bg-surface-raised p-2.5">
                <div class="flex items-center gap-2 mb-1">
                  <BaseBadge :variant="evt.rarity === 'rare' ? 'danger' : evt.rarity === 'key' ? 'primary' : 'default'">
                    {{ evt.rarity === 'rare' ? '稀有' : evt.rarity === 'key' ? '关键' : '普通' }}
                  </BaseBadge>
                  <span class="text-sm font-medium text-heading">{{ evt.title }}</span>
                </div>
                <p class="text-xs text-body mb-1">{{ evt.description }}</p>
                <!-- Rewards -->
                <div v-if="evt.rewards.experience || evt.rewards.stats" class="flex flex-wrap gap-1.5 mt-1">
                  <span v-if="evt.rewards.experience" class="text-xs text-primary">+{{ evt.rewards.experience }} EXP</span>
                  <span v-for="(val, stat) in (evt.rewards.stats ?? {})" :key="stat" class="text-xs text-success">
                    +{{ val }} {{ stat }}
                  </span>
                </div>
              </div>
              <div v-if="log.events.length === 0" class="text-xs text-muted text-center py-2">
                未触发事件
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
