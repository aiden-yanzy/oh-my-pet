import { describe, it, expect } from 'vitest'
import {
  checkEvolution,
  getAvailableEvolutions,
  getNextEvolutions,
  unlockSkill,
} from '@/services/evolutionService'
import type { Pet } from '@/types/pet'
import type { Evolution } from '@/types/evolution'

function createMockPet(overrides: Partial<Pet> = {}): Pet {
  return {
    id: 'pet-1',
    name: 'TestPet',
    createdAt: Date.now(),
    lastActiveAt: Date.now(),
    dna: {
      strengthGene: 1.0,
      intelligenceGene: 1.0,
      agilityGene: 1.0,
      personality: 'lively',
    },
    stats: {
      happiness: 50,
      health: 50,
      experience: 0,
      level: 1,
      strength: 10,
      intelligence: 10,
      agility: 10,
      charm: 5,
    },
    appearance: {
      formStage: 0,
      dominantType: 'balanced',
      colorScheme: 'default',
      styleId: 'cat',
      accessories: [],
    },
    skills: [],
    ...overrides,
  }
}

const evolLevel10: Evolution = {
  id: 'evo_level_10',
  fromStage: 0,
  toStage: 1,
  name: '初级进化',
  description: '宠物成长了！',
  dominantType: 'balanced',
  conditions: [{ type: 'level', params: { minLevel: 10 } }],
  unlockedSkills: ['fast_recovery'],
}

const evolStrength20: Evolution = {
  id: 'evo_strength_20',
  fromStage: 1,
  toStage: 2,
  name: '力量形态',
  description: '力量主导的进化',
  dominantType: 'strength',
  conditions: [
    { type: 'level', params: { minLevel: 20 } },
    { type: 'stat', params: { stat: 'strength', minValue: 100 } },
  ],
  unlockedSkills: ['strong_body'],
}

const evolIntelligence20: Evolution = {
  id: 'evo_intelligence_20',
  fromStage: 1,
  toStage: 2,
  name: '智慧形态',
  description: '智力主导的进化',
  dominantType: 'intelligence',
  conditions: [
    { type: 'level', params: { minLevel: 20 } },
    { type: 'stat', params: { stat: 'intelligence', minValue: 100 } },
  ],
  unlockedSkills: ['sharp_mind'],
}

const allEvolutions: Evolution[] = [
  evolLevel10,
  evolStrength20,
  evolIntelligence20,
]

describe('evolutionService', () => {
  describe('checkEvolution', () => {
    it('returns the matching evolution when conditions are met', () => {
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 10 },
      })

      const result = checkEvolution(pet, allEvolutions)
      expect(result).not.toBeNull()
      expect(result!.id).toBe('evo_level_10')
    })

    it('returns null when no conditions are met', () => {
      const pet = createMockPet({ stats: { ...createMockPet().stats, level: 1 } })

      const result = checkEvolution(pet, allEvolutions)
      expect(result).toBeNull()
    })

    it('respects fromStage — does not match evolutions for other stages', () => {
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 10 },
        appearance: { formStage: 2, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = checkEvolution(pet, allEvolutions)
      expect(result).toBeNull()
    })

    it('matches compound conditions (level + stat)', () => {
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 20, strength: 120 },
        appearance: { formStage: 1, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = checkEvolution(pet, allEvolutions)
      expect(result).not.toBeNull()
      expect(result!.id).toBe('evo_strength_20')
    })

    it('returns null when compound conditions partially fail', () => {
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 20, strength: 50 },
        appearance: { formStage: 1, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = checkEvolution(pet, allEvolutions)
      expect(result).toBeNull()
    })

    it('returns first matching evolution in order', () => {
      // When multiple evolutions match fromStage, return the first
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 10 },
        appearance: { formStage: 0, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = checkEvolution(pet, allEvolutions)
      expect(result!.id).toBe('evo_level_10')
    })
  })

  describe('getAvailableEvolutions', () => {
    it('returns all evolutions whose conditions are met', () => {
      const pet = createMockPet({
        stats: { ...createMockPet().stats, level: 20, strength: 120, intelligence: 110 },
        appearance: { formStage: 1, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = getAvailableEvolutions(pet, allEvolutions)
      // All three evolutions match:
      //   evo_level_10 (level >= 10 ✓)
      //   evo_strength_20 (level >= 20 ✓ + strength >= 100 ✓)
      //   evo_intelligence_20 (level >= 20 ✓ + intelligence >= 100 ✓)
      expect(result.length).toBe(3)
      expect(result.map((e) => e.id)).toContain('evo_level_10')
      expect(result.map((e) => e.id)).toContain('evo_strength_20')
      expect(result.map((e) => e.id)).toContain('evo_intelligence_20')
    })

    it('returns empty array when no conditions are met', () => {
      const pet = createMockPet()

      const result = getAvailableEvolutions(pet, allEvolutions)
      expect(result).toEqual([])
    })
  })

  describe('getNextEvolutions', () => {
    it('returns evolutions matching the pet formStage', () => {
      const pet = createMockPet({
        appearance: { formStage: 0, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = getNextEvolutions(pet, allEvolutions)
      expect(result.length).toBe(1)
      expect(result[0]!.id).toBe('evo_level_10')
    })

    it('returns all stage-1 evolutions for pets at formStage 1', () => {
      const pet = createMockPet({
        appearance: { formStage: 1, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = getNextEvolutions(pet, allEvolutions)
      expect(result.length).toBe(2)
      expect(result.map((e) => e.id)).toContain('evo_strength_20')
      expect(result.map((e) => e.id)).toContain('evo_intelligence_20')
    })

    it('returns empty array when no evolutions match the current stage', () => {
      const pet = createMockPet({
        appearance: { formStage: 99, dominantType: 'balanced', colorScheme: 'default', styleId: 'cat', accessories: [] },
      })

      const result = getNextEvolutions(pet, allEvolutions)
      expect(result).toEqual([])
    })
  })

  describe('unlockSkill', () => {
    it('adds a skill to the pet skills list', () => {
      const pet = createMockPet()

      const updated = unlockSkill(pet, 'fast_recovery')
      expect(updated.skills).toContain('fast_recovery')
    })

    it('does not duplicate an existing skill', () => {
      const pet = createMockPet({ skills: ['fast_recovery'] })

      const updated = unlockSkill(pet, 'fast_recovery')
      expect(updated.skills).toEqual(['fast_recovery'])
    })

    it('returns a new object without mutating the original', () => {
      const pet = createMockPet()

      const updated = unlockSkill(pet, 'fast_recovery')
      expect(updated).not.toBe(pet)
      expect(pet.skills).not.toContain('fast_recovery')
    })

    it('can unlock multiple distinct skills', () => {
      const pet = createMockPet()

      const step1 = unlockSkill(pet, 'fast_recovery')
      const step2 = unlockSkill(step1, 'strong_body')

      expect(step2.skills).toEqual(['fast_recovery', 'strong_body'])
    })
  })
})
