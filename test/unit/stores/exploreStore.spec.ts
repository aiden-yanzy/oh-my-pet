import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useExploreStore } from '@/stores/exploreStore'
import { usePetStore } from '@/stores/petStore'
import type { GameEvent } from '@/types/event'

// Mock storage service
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
    StorageService: vi.fn(() => mockStorage),
    storageService: mockStorage,
  }
})

// Mock DNA service
vi.mock('@/services/dnaService', () => ({
  generateDNA: vi.fn(() => ({
    strengthGene: 1.0,
    intelligenceGene: 1.0,
    agilityGene: 1.0,
    personality: 'curious' as const,
  })),
  applyGene: vi.fn((_dna: unknown, _statType: string, baseValue: number) => baseValue),
}))

// Mock event service with deterministic event
const mockEvent: GameEvent = {
  id: 'grassland_food_1',
  title: '发现浆果',
  description: '在草丛中发现了新鲜的浆果',
  sceneId: 'grassland',
  rarity: 'common',
  rewards: { experience: 10, items: ['apple'] },
}

vi.mock('@/services/eventService', () => ({
  generateEvent: vi.fn(() => mockEvent),
  generateWithAI: vi.fn(() => Promise.resolve(null)),
}))

describe('exploreStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('startExploration', () => {
    it('sets isExploring to true and currentScene', () => {
      const store = useExploreStore()
      store.startExploration('grassland')

      expect(store.isExploring).toBe(true)
      expect(store.currentScene).toBe('grassland')
    })

    it('does nothing if already exploring', () => {
      const store = useExploreStore()
      store.startExploration('grassland')
      expect(store.isExploring).toBe(true)

      store.startExploration('forest')

      // Should remain on grassland
      expect(store.currentScene).toBe('grassland')
    })

    it('schedules completion after a timeout', () => {
      const store = useExploreStore()
      store.startExploration('grassland')

      // The timeout caps at 30000ms for testing
      expect(store.isExploring).toBe(true)
    })
  })

  describe('completeExploration', () => {
    it('creates exploration log with events', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.completeExploration('grassland', 60000)

      expect(exploreStore.logs.length).toBe(1)
      expect(exploreStore.logs[0]!.sceneId).toBe('grassland')
      expect(exploreStore.logs[0]!.viewed).toBe(false)
      expect(exploreStore.logs[0]!.events.length).toBeGreaterThanOrEqual(1)
      expect(exploreStore.logs[0]!.events[0]!.id).toBe('grassland_food_1')
    })

    it('applies event rewards to the pet', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      const expBefore = petStore.pet!.stats.experience
      exploreStore.completeExploration('grassland', 60000)

      expect(petStore.pet!.stats.experience).toBeGreaterThan(expBefore)
    })

    it('resets isExploring and currentScene after completion', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.completeExploration('grassland', 60000)

      expect(exploreStore.isExploring).toBe(false)
      expect(exploreStore.currentScene).toBeNull()
    })

    it('keeps at most 50 logs', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      for (let i = 0; i < 60; i++) {
        exploreStore.completeExploration('grassland', 60000)
      }

      expect(exploreStore.logs.length).toBeLessThanOrEqual(50)
    })

    it('is a no-op if no pet exists', () => {
      const exploreStore = useExploreStore()
      exploreStore.completeExploration('grassland', 60000)

      expect(exploreStore.logs.length).toBe(0)
    })
  })

  describe('markAsViewed', () => {
    it('marks a log as viewed', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.completeExploration('grassland', 60000)
      const logId = exploreStore.logs[0]!.id

      exploreStore.markAsViewed(logId)

      expect(exploreStore.logs[0]!.viewed).toBe(true)
    })

    it('does nothing for non-existent log id', () => {
      const exploreStore = useExploreStore()
      expect(() => exploreStore.markAsViewed('nonexistent')).not.toThrow()
    })
  })

  describe('unviewedLogs', () => {
    it('returns only logs that have not been viewed', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.completeExploration('grassland', 60000)
      exploreStore.completeExploration('grassland', 60000)
      exploreStore.markAsViewed(exploreStore.logs[0]!.id)

      expect(exploreStore.unviewedLogs.length).toBe(1)
    })
  })

  describe('recentLogs', () => {
    it('returns up to 10 most recent logs', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      for (let i = 0; i < 15; i++) {
        exploreStore.completeExploration('grassland', 60000)
      }

      expect(exploreStore.recentLogs.length).toBe(10)
    })
  })

  describe('generateOfflineExplorations', () => {
    it('generates exploration logs based on offline hours', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.generateOfflineExplorations(10, 'grassland')

      // 10 hours / 2 = 5 explorations
      expect(exploreStore.logs.length).toBe(5)
      expect(exploreStore.logs[0]!.sceneId).toBe('grassland')
      expect(exploreStore.logs[0]!.id).toMatch(/^explore_offline_/)
    })

    it('caps at 84 explorations (168 hours / 2)', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.generateOfflineExplorations(200, 'grassland')

      expect(exploreStore.logs.length).toBeLessThanOrEqual(84)
    })

    it('is a no-op if no pet exists', () => {
      const exploreStore = useExploreStore()
      exploreStore.generateOfflineExplorations(10, 'grassland')

      expect(exploreStore.logs.length).toBe(0)
    })

    it('applies experience rewards to the pet', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      const expBefore = petStore.pet!.stats.experience
      exploreStore.generateOfflineExplorations(4, 'grassland')

      expect(petStore.pet!.stats.experience).toBeGreaterThan(expBefore)
    })

    it('keeps at most 50 logs total', async () => {
      const petStore = usePetStore()
      await petStore.createPet('Test')
      const exploreStore = useExploreStore()

      exploreStore.generateOfflineExplorations(200, 'grassland')

      expect(exploreStore.logs.length).toBeLessThanOrEqual(50)
    })
  })
})
