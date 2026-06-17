import type { DailyTask } from '@/types/task';

export const DAILY_TASK_TEMPLATES: Omit<DailyTask, 'progress' | 'completed'>[] = [
  { id: 'task_feed_3', title: '🥘 喂食3次', description: '给宠物喂食3次', type: 'feed', target: 3, rewards: { experience: 20, items: [{ type: 'food', amount: 2 }] } },
  { id: 'task_play_5', title: '🎮 玩耍5次', description: '和宠物玩5次游戏', type: 'play', target: 5, rewards: { experience: 30, items: [{ type: 'toy_strength', amount: 1 }] } },
  { id: 'task_explore_1', title: '🔍 探索1次', description: '完成1次探索', type: 'explore', target: 1, rewards: { experience: 25 } },
  { id: 'task_full_happy', title: '😊 满快乐度', description: '让宠物快乐度达到100', type: 'stat', target: 1, rewards: { experience: 15 } },
  { id: 'task_online_10', title: '⏱️ 在线10分钟', description: '累计在线10分钟', type: 'time', target: 600, rewards: { experience: 10, items: [{ type: 'food', amount: 1 }] } },
];
