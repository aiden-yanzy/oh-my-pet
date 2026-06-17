export interface GameState {
  isPaused: boolean;
  lastTickTime: number;
  totalPlayTime: number;
}

export interface OfflineData {
  offlineHours: number;
  explorationCount: number;
  statsChange: Record<string, number>;
}
