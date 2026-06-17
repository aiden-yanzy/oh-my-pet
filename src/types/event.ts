export interface Scene {
  id: string;
  name: string;
  unlockLevel: number;
  theme: 'strength' | 'intelligence' | 'agility' | 'balanced';
}

export interface EventChoice {
  text: string;
  effects: {
    happiness?: number;
    health?: number;
    strength?: number;
    intelligence?: number;
    agility?: number;
    experience?: number;
  };
  item?: string | null;
}

export interface EventRewards {
  experience?: number;
  items?: string[];
  stats?: Partial<Record<string, number>>;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  sceneId: string;
  rarity: 'common' | 'rare' | 'key';
  choices?: EventChoice[];
  rewards: EventRewards;
}

export interface ExplorationLog {
  id: string;
  sceneId: string;
  startTime: number;
  endTime: number;
  events: GameEvent[];
  viewed: boolean;
}
