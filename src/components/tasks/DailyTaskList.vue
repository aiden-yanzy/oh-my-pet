<script setup lang="ts">
import { onMounted } from 'vue';
import { useTaskStore } from '@/stores/taskStore';
import BaseBadge from '@/components/BaseBadge.vue';

const taskStore = useTaskStore();

onMounted(() => {
  taskStore.refreshTasks();
});

const typeIcons: Record<string, string> = {
  feed: '🍖', play: '🎮', explore: '🔍', stat: '📊', time: '⏱️',
};

function formatReward(rewards: { experience: number; items?: Array<{ type: string; amount: number }> }): string {
  const parts: string[] = [];
  if (rewards.experience > 0) parts.push(`${rewards.experience} EXP`);
  if (rewards.items) {
    rewards.items.forEach(item => {
      parts.push(`x${item.amount} ${item.type}`);
    });
  }
  return parts.join(' + ');
}
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-sm font-semibold text-heading mb-3">每日任务</h3>
    <div v-if="taskStore.dailyTasks.length === 0" class="text-center text-muted py-6">
      <span class="text-3xl">📋</span>
      <p class="mt-2 text-sm">暂无任务</p>
    </div>
    <div
      v-for="task in taskStore.dailyTasks"
      :key="task.id"
      class="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors"
      :class="task.completed ? 'opacity-50' : 'hover:bg-surface-raised'"
    >
      <span class="text-xl">{{ typeIcons[task.type] ?? '📌' }}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium text-heading truncate">{{ task.title }}</span>
          <BaseBadge v-if="task.completed" variant="success">✓</BaseBadge>
        </div>
        <div class="mt-1.5 flex items-center gap-2">
          <div class="flex-1 h-1.5 rounded-full bg-surface-raised overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="task.completed ? 'bg-success' : 'bg-primary'"
              :style="{ width: `${(task.progress / task.target) * 100}%` }"
            />
          </div>
          <span class="text-xs text-muted flex-shrink-0">{{ task.progress }}/{{ task.target }}</span>
        </div>
        <div class="mt-1 text-[10px] text-muted">
          奖励: {{ formatReward(task.rewards) }}
        </div>
      </div>
    </div>
  </div>
</template>
