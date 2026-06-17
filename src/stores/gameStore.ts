import { defineStore } from 'pinia';
import { ref } from 'vue';
import { usePetStore } from './petStore';
import { useExploreStore } from './exploreStore';

export const useGameStore = defineStore('game', () => {
  const isRunning = ref(false);
  const lastTickTime = ref(Date.now());
  const totalPlayTime = ref(0);
  const offlineHours = ref(0);
  const showOfflineSummary = ref(false);

  function startGameLoop() {
    if (isRunning.value) return;
    isRunning.value = true;
    lastTickTime.value = Date.now();
    tick();
  }

  function tick() {
    if (!isRunning.value) return;
    const now = Date.now();
    const delta = (now - lastTickTime.value) / 1000;
    totalPlayTime.value += delta;
    lastTickTime.value = now;
    // Pet game tick (poop aging, sleeping recovery, stat decay)
    const petStore = usePetStore();
    petStore.gameTick();
    setTimeout(tick, 60000); // tick every minute
  }

  function stopGameLoop() {
    isRunning.value = false;
  }

  function calculateOffline() {
    const petStore = usePetStore();
    if (!petStore.pet) return;
    const now = Date.now();
    const elapsed = (now - petStore.pet.lastActiveAt) / (1000 * 60 * 60);
    if (elapsed < 1) return;
    offlineHours.value = Math.min(elapsed, 168); // max 7 days
    // Recover base stats up to 70%
    const recovery = Math.min(offlineHours.value * 2, 70);
    petStore.pet.stats.happiness = Math.min(70, petStore.pet.stats.happiness + recovery);
    petStore.pet.stats.health = Math.min(70, petStore.pet.stats.health + recovery);
    // Generate offline explorations
    const exploreStore = useExploreStore();
    const sceneId = 'grassland';
    exploreStore.generateOfflineExplorations(offlineHours.value, sceneId);
    showOfflineSummary.value = true;
    petStore.savePet();
  }

  function dismissOfflineSummary() {
    showOfflineSummary.value = false;
    offlineHours.value = 0;
  }

  return { isRunning, totalPlayTime, offlineHours, showOfflineSummary,
    startGameLoop, stopGameLoop, calculateOffline, dismissOfflineSummary };
});
