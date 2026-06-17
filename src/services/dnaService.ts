import type { DNA, Personality, PetStats } from '@/types/pet'

const PERSONALITIES: Personality[] = ['lively', 'quiet', 'foodie', 'aloof', 'curious']

function randomBetween(min: number, max: number): number {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!
}

export function generateDNA(): DNA {
  return {
    strengthGene: randomBetween(0.8, 1.2),
    intelligenceGene: randomBetween(0.8, 1.2),
    agilityGene: randomBetween(0.8, 1.2),
    personality: pickRandom(PERSONALITIES),
  }
}

export function applyGene(
  dna: DNA,
  statType: keyof Pick<PetStats, 'strength' | 'intelligence' | 'agility'>,
  baseValue: number,
): number {
  switch (statType) {
    case 'strength':
      return Math.round(baseValue * dna.strengthGene)
    case 'intelligence':
      return Math.round(baseValue * dna.intelligenceGene)
    case 'agility':
      return Math.round(baseValue * dna.agilityGene)
  }
}
