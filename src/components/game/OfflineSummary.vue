<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '@/stores/gameStore';
import { useExploreStore } from '@/stores/exploreStore';
import BaseButton from '@/components/BaseButton.vue';

const gameStore = useGameStore();
const exploreStore = useExploreStore();

const offlineLogs = computed(() => exploreStore.recentLogs.filter(l => l.id.startsWith('explore_offline')));

const totalItems = computed(() => {
  let count = 0;
  offlineLogs.value.forEach(log => {
    log.events.forEach(evt => {
      if (evt.rewards.items) count += evt.rewards.items.length;
    });
  });
  return count;
});

function dismiss() {
  gameStore.dismissOfflineSummary();
}
</script>

<template>
  <div
    v-if="gameStore.showOfflineSummary"
    class="fixed inset-0 z-40 flex items-center justify-center"
  >
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70" />

    <!-- Modal -->
    <div class="relative w-80 rounded-2xl bg-surface border border-border p-6 text-center shadow-2xl">
      <div class="text-4xl mb-3">🌅</div>
      <h2 class="text-lg font-bold text-heading mb-1">欢迎回来！</h2>
      <p class="text-sm text-muted mb-4">你不在的时候发生了一些事情</p>

      <div class="space-y-2 mb-5">
        <div class="flex justify-between text-sm">
          <span class="text-muted">⏱️ 离线时间</span>
          <span class="text-heading font-medium">{{ Math.round(gameStore.offlineHours) }} 小时</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">🗺️ 探索次数</span>
          <span class="text-heading font-medium">{{ offlineLogs.length }} 次</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">🎁 获得物品</span>
          <span class="text-heading font-medium">{{ totalItems }} 个</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-muted">❤️ 心情/体力</span>
          <span class="text-success font-medium">恢复至 70%</span>
        </div>
      </div>

      <BaseButton variant="primary" size="lg" class="w-full" @click="dismiss">
        知道了！
      </BaseButton>
    </div>
  </div>
</template>
