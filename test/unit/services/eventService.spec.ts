import { describe, it, expect, vi } from 'vitest'
import { generateEvent, generateWithAI } from '@/services/eventService'

describe('eventService', () => {
  describe('generateEvent', () => {
    it('returns a GameEvent for a valid sceneId', () => {
      const event = generateEvent('grassland', 5, 'balanced')

      expect(event).not.toBeNull()
      expect(event).toHaveProperty('id')
      expect(event).toHaveProperty('title')
      expect(event).toHaveProperty('description')
      expect(event!.sceneId).toBe('grassland')
    })

    it('returns null for a sceneId with no events', () => {
      const event = generateEvent('nonexistent', 5, 'balanced')
      expect(event).toBeNull()
    })

    it('returns events matching the given sceneId', () => {
      for (let i = 0; i < 50; i++) {
        const event = generateEvent('forest', 10, 'intelligence')
        expect(event).not.toBeNull()
        expect(event!.sceneId).toBe('forest')
      }
    })

    it('returns events with valid rarity (common, rare, or key)', () => {
      for (let i = 0; i < 50; i++) {
        const event = generateEvent('grassland', 5, 'balanced')
        expect(event).not.toBeNull()
        expect(['common', 'rare', 'key']).toContain(event!.rarity)
      }
    })

    it('returns common events most of the time', () => {
      let commonCount = 0
      const total = 1000

      for (let i = 0; i < total; i++) {
        const event = generateEvent('grassland', 5, 'balanced')
        if (event?.rarity === 'common') commonCount++
      }

      // Common events should appear more than half the time (>50 out of 100)
      expect(commonCount).toBeGreaterThan(total * 0.5)
    })

    it('can return rare events', () => {
      let rareCount = 0
      const total = 1000

      for (let i = 0; i < total; i++) {
        const event = generateEvent('grassland', 5, 'balanced')
        if (event?.rarity === 'rare') rareCount++
      }

      // With 25% weight, should see at least a few in 1000 trials
      expect(rareCount).toBeGreaterThan(0)
    })
  })

  describe('generateWithAI', () => {
    it('returns null (stub for future AI enhancement)', async () => {
      const result = await generateWithAI('grassland', 5, 'balanced')
      expect(result).toBeNull()
    })
  })
})
