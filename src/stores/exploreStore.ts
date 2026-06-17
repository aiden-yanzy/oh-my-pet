import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ExplorationLog, GameEvent } from '@/types/event';
import { generateEvent } from '@/services/eventService';
import { usePetStore } from './petStore';
import { useInventoryStore } from './inventoryStore';

export const useExploreStore = defineStore('explore', () => {
  const logs = ref<ExplorationLog[]>([]);
  const isExploring = ref(false);
  const currentScene = ref<string | null>(null);

  const unviewedLogs = computed(() => logs.value.filter(l => !l.viewed));
  const recentLogs = computed(() => logs.value.slice(0, 10));

  function startExploration(sceneId: string) {
    if (isExploring.value) return;
    isExploring.value = true;
    currentScene.value = sceneId;
    const duration = (5 + Math.random() * 10) * 60 * 1000;
    setTimeout(() => completeExploration(sceneId, duration), Math.min(duration, 30000));
  }

  function processEventRewards(pet: { stats: Record<string, number>; }, evt: GameEvent) {
    if (evt.rewards.experience) pet.stats.experience = (pet.stats.experience ?? 0) + evt.rewards.experience;
    if (evt.rewards.stats) {
      for (const [stat, value] of Object.entries(evt.rewards.stats)) {
        if (stat in pet.stats && typeof value === 'number') {
          pet.stats[stat] = (pet.stats[stat] ?? 0) + value;
        }
      }
    }
  }

  function completeExploration(sceneId: string, duration: number) {
    const petStore = usePetStore();
    if (!petStore.pet) return;
    const pet = petStore.pet;
    const eventCount = 1 + Math.floor(Math.random() * 3);
    const events: GameEvent[] = [];
    for (let i = 0; i < eventCount; i++) {
      const evt = generateEvent(sceneId, pet.stats.level, pet.appearance.dominantType);
      if (evt) events.push(evt);
    }
    events.forEach(evt => processEventRewards(pet, evt));
    // Exploration gives food rewards
    const invStore = useInventoryStore();
    const foodCount = 1 + Math.floor(Math.random() * 3);
    invStore.addRandom(foodCount);
    const log: ExplorationLog = { id: `explore_${Date.now()}`, sceneId, startTime: Date.now() - duration, endTime: Date.now(), events, viewed: false };
    logs.value.unshift(log);
    if (logs.value.length > 50) logs.value = logs.value.slice(0, 50);
    isExploring.value = false;
    currentScene.value = null;
    petStore.savePet();
  }

  function markAsViewed(logId: string) {
    const log = logs.value.find(l => l.id === logId);
    if (log) log.viewed = true;
  }

  function generateOfflineExplorations(offlineHours: number, sceneId: string) {
    const count = Math.min(Math.floor(offlineHours / 2), 84);
    for (let i = 0; i < count; i++) {
      const petStore = usePetStore();
      if (!petStore.pet) break;
      const pet = petStore.pet;
      const eventCount = 1 + Math.floor(Math.random() * 2);
      const events: GameEvent[] = [];
      for (let j = 0; j < eventCount; j++) {
        const evt = generateEvent(sceneId, pet.stats.level, pet.appearance.dominantType);
        if (evt) events.push(evt);
      }
      events.forEach(evt => processEventRewards(pet, evt));
      // Offline exploration gives food
      const invStore = useInventoryStore();
      invStore.addRandom(1 + Math.floor(Math.random() * 2));
      const log: ExplorationLog = { id: `explore_offline_${Date.now()}_${i}`, sceneId, startTime: Date.now(), endTime: Date.now(), events, viewed: false };
      logs.value.push(log);
    }
    if (logs.value.length > 50) logs.value = logs.value.slice(0, 50);
  }

  return { logs, isExploring, currentScene, unviewedLogs, recentLogs,
    startExploration, completeExploration, markAsViewed, generateOfflineExplorations };
});
