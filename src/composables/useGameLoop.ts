import { onMounted, onUnmounted } from 'vue';
import { useGameStore } from '@/stores/gameStore';

export function useGameLoop() {
  const gameStore = useGameStore();

  function start() {
    gameStore.calculateOffline();
    gameStore.startGameLoop();
  }

  function stop() {
    gameStore.stopGameLoop();
  }

  onMounted(() => start());
  onUnmounted(() => stop());

  return { start, stop };
}
