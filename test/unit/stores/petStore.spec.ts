import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePetStore } from '@/stores/petStore'
import type { Pet } from '@/types/pet'

// Mock storage service instance
vi.mock('@/services/storageService', () => {
  const mockStorage = {
    init: vi.fn(),
    getPet: vi.fn(),
    setPet: vi.fn(),
    setTasks: vi.fn(),
    getTasks: vi.fn(),
    setExplorations: vi.fn(),
    getExplorations: vi.fn(),
    setInventory: vi.fn(),
    getInventory: vi.fn(),
    getFromCache: vi.fn(),
    setCache: vi.fn(),
  }
  return {
    storageService: mockStorage,
  }
})

// Mock DNA service with deterministic values
vi.mock('@/services/dnaService', () => ({
  generateDNA: vi.fn(() => ({
    strengthGene: 1.0,
    intelligenceGene: 1.0,
    agilityGene: 1.0,
    personality: 'curious' as const,
  })),
  applyGene: vi.fn((_dna: unknown, _statType: string, baseValue: number) => baseValue),
}))

// Mock evolutionService — passive (no evolutions triggered by default)
vi.mock('@/services/evolutionService', () => ({
  checkEvolution: vi.fn(() => null),
  getNextEvolutions: vi.fn(() => []),
  getAvailableEvolutions: vi.fn(() => []),
  unlockSkill: vi.fn((pet: Pet, _skillId: string) => pet),
}))

describe('petStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.resetAllMocks()
  })

  describe('createPet', () => {
    it('creates a pet with the given name and default stats', async () => {
      const store = usePetStore()
      expect(store.pet).toBeNull()

      await store.createPet('Fluffy')

      expect(store.pet).not.toBeNull()
      expect(store.pet!.name).toBe('Fluffy')
      expect(store.pet!.stats.happiness).toBe(100)
      expect(store.pet!.stats.health).toBe(100)
      expect(store.pet!.stats.experience).toBe(0)
      expect(store.pet!.stats.level).toBe(1)
      expect(store.pet!.stats.strength).toBe(0)
      expect(store.pet!.stats.intelligence).toBe(0)
      expect(store.pet!.stats.agility).toBe(0)
      expect(store.pet!.stats.charm).toBe(0)
      expect(store.pet!.appearance.formStage).toBe(0)
      expect(store.pet!.appearance.dominantType).toBe('balanced')
      expect(store.pet!.appearance.colorScheme).toBe('default')
      expect(store.pet!.skills).toEqual([])
      expect(store.pet!.id).toMatch(/^pet_/)
    })

    it('sets the pet id with a timestamp prefix', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      expect(store.pet!.id).toMatch(/^pet_\d+$/)
    })
  })

  describe('computed properties', () => {
    it('returns level 1 and default exp values when no pet exists', () => {
      const store = usePetStore()
      expect(store.level).toBe(1)
      expect(store.experienceToNext).toBe(100)
      expect(store.expProgress).toBe(0)
      expect(store.availableEvolutions).toEqual([])
      expect(store.canEvolve).toBe(false)
    })

    it('computes experienceToNext based on level', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      expect(store.experienceToNext).toBe(100) // floor(100 * 1.5^0) = 100
    })

    it('computes expProgress as current / required', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      store.pet!.stats.experience = 30
      expect(store.expProgress).toBe(0.3)
    })
  })

  describe('feed', () => {
    it('applies health effect from food type', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.feed('meat')

      expect(store.pet!.stats.health).toBe(100) // was 100, min(100, 100+20)
    })

    it('applies happiness effect from snack food', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      store.pet!.stats.happiness = 50

      store.feed('snack')

      expect(store.pet!.stats.happiness).toBe(60) // 50 + 10
    })

    it('applies experience effect', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.feed('meat')

      expect(store.pet!.stats.experience).toBe(5)
    })

    it('applies stat effect for meat (strength)', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.feed('meat')

      // applyGene returns baseValue (3) since mocked to return baseValue
      expect(store.pet!.stats.strength).toBe(3)
    })

    it('applies stat effect for vegetable (intelligence)', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.feed('vegetable')

      expect(store.pet!.stats.intelligence).toBe(3)
    })

    it('applies stat effect for snack (agility)', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.feed('snack')

      expect(store.pet!.stats.agility).toBe(2)
    })

    it('is a no-op if no pet exists', () => {
      const store = usePetStore()
      expect(() => store.feed('meat')).not.toThrow()
    })

    it('is a no-op for unknown food type', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      const expBefore = store.pet!.stats.experience

      store.feed('nonexistent')

      expect(store.pet!.stats.experience).toBe(expBefore)
    })
  })

  describe('play', () => {
    it('increases happiness by 15 capped at 100', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      store.pet!.stats.happiness = 90

      store.play('strength')

      expect(store.pet!.stats.happiness).toBe(100) // min(100, 90+15)
    })

    it('increases experience by 5', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.play('strength')

      expect(store.pet!.stats.experience).toBe(5)
    })

    it('increases the target stat via DNA gene', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.play('strength')

      expect(store.pet!.stats.strength).toBe(2) // applyGene mock returns baseValue
    })

    it('is a no-op if no pet exists', () => {
      const store = usePetStore()
      expect(() => store.play('strength')).not.toThrow()
    })
  })

  describe('rest', () => {
    it('toggles sleep state', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.toggleSleep()
      expect(store.isSleeping).toBe(true)

      store.toggleSleep()
      expect(store.isSleeping).toBe(false)
    })

    it('is a no-op if no pet exists', () => {
      const store = usePetStore()
      expect(() => store.toggleSleep()).not.toThrow()
    })
  })

  describe('level up', () => {
    it('levels up when experience exceeds threshold', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      // Fill experience just below threshold
      store.pet!.stats.experience = 99
      store.play('strength') // adds 5 exp -> 104, should level up
      expect(store.pet!.stats.level).toBeGreaterThanOrEqual(2)
    })

    it('reduces experience by threshold on level up', async () => {
      const store = usePetStore()
      await store.createPet('Test')

      store.pet!.stats.experience = 99
      store.play('strength')

      // exp = 99 + 5 = 104, threshold = 100, leftover = 4
      expect(store.pet!.stats.level).toBe(2)
      // After level up, experience should be 104 - 100 = 4
      expect(store.pet!.stats.experience).toBe(4)
    })
  })

  describe('deletePet', () => {
    it('sets pet to null and persists', async () => {
      const store = usePetStore()
      await store.createPet('Test')
      expect(store.pet).not.toBeNull()

      await store.deletePet()

      expect(store.pet).toBeNull()
    })
  })

  describe('loadLatestPet', () => {
    it('loads a pet from storage when one exists', async () => {
      const { storageService } = await import('@/services/storageService')
      const mockPet: Pet = {
        id: 'pet_loaded_1',
        name: 'Loaded',
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
        dna: { strengthGene: 1.1, intelligenceGene: 0.9, agilityGene: 1.0, personality: 'lively' },
        stats: { happiness: 80, health: 90, experience: 50, level: 5, strength: 10, intelligence: 8, agility: 12, charm: 3 },
        appearance: { formStage: 1, dominantType: 'strength', colorScheme: 'default', styleId: 'cat', accessories: [] },
        skills: ['fast_recovery'],
      }
      vi.mocked(storageService.getPet).mockResolvedValue(mockPet)

      const store = usePetStore()
      await store.loadLatestPet()

      expect(store.pet).not.toBeNull()
      expect(store.pet!.name).toBe('Loaded')
      expect(store.pet!.stats.level).toBe(5)
    })

    it('leaves pet as null when no stored pet exists', async () => {
      const store = usePetStore()
      await store.loadLatestPet()
      expect(store.pet).toBeNull()
    })
  })
})
