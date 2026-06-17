import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DailyTask } from '@/types/task';
import { DAILY_TASK_TEMPLATES } from '@/data/tasks';

export const useTaskStore = defineStore('task', () => {
  const dailyTasks = ref<DailyTask[]>([]);
  const lastRefreshDate = ref<string>('');

  const completedCount = computed(() => dailyTasks.value.filter(t => t.completed).length);
  const pendingTasks = computed(() => dailyTasks.value.filter(t => !t.completed));
  const allCompleted = computed(() => dailyTasks.value.length > 0 && dailyTasks.value.every(t => t.completed));

  function refreshTasks() {
    const today = new Date().toISOString().split('T')[0] ?? '';
    if (lastRefreshDate.value === today && dailyTasks.value.length > 0) return;
    dailyTasks.value = DAILY_TASK_TEMPLATES.map(t => ({
      ...t,
      progress: 0,
      completed: false,
    }));
    lastRefreshDate.value = today;
  }

  function updateProgress(taskType: string, amount = 1) {
    dailyTasks.value.forEach(task => {
      if (!task.completed && task.type === taskType) {
        task.progress = Math.min(task.target, task.progress + amount);
        if (task.progress >= task.target) {
          task.completed = true;
        }
      }
    });
  }

  function claimReward(taskId: string) {
    const task = dailyTasks.value.find(t => t.id === taskId);
    if (!task || !task.completed) return null;
    return task.rewards;
  }

  return { dailyTasks, completedCount, pendingTasks, allCompleted,
    refreshTasks, updateProgress, claimReward };
});
