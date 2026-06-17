export type Personality = 'lively' | 'quiet' | 'foodie' | 'aloof' | 'curious';

export interface DNA {
  strengthGene: number;      // 0.8 - 1.2
  intelligenceGene: number;  // 0.8 - 1.2
  agilityGene: number;       // 0.8 - 1.2
  personality: Personality;
}

export interface PetBaseStats {
  happiness: number;      // 0-100
  health: number;         // 0-100
  experience: number;
  level: number;
}

export interface PetGrowthStats {
  strength: number;
  intelligence: number;
  agility: number;
  charm: number;
}

export type PetStats = PetBaseStats & PetGrowthStats;

export interface PetAppearance {
  formStage: number;
  dominantType: 'balanced' | 'strength' | 'intelligence' | 'agility';
  colorScheme: string;
}

export interface Pet {
  id: string;
  name: string;
  createdAt: number;
  lastActiveAt: number;
  dna: DNA;
  stats: PetStats;
  appearance: PetAppearance;
  skills: string[];
  userId?: string | null;
  syncedAt?: number | null;
}
