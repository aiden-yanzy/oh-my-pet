export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'interaction' | 'exploration';
  effect: Record<string, number | string>;
}

export interface EvolutionCondition {
  type: 'level' | 'stat' | 'item' | 'event' | 'compound' | 'time' | 'rare';
  params: Record<string, unknown>;
}

export interface Evolution {
  id: string;
  fromStage: number;
  toStage: number;
  name: string;
  description: string;
  dominantType: 'strength' | 'intelligence' | 'agility' | 'balanced';
  conditions: EvolutionCondition[];
  unlockedSkills?: string[];
}
