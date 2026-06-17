import { describe, it, expect, vi } from 'vitest'
import { generateDNA, applyGene } from '@/services/dnaService'
import type { DNA } from '@/types/pet'

describe('dnaService', () => {
  describe('generateDNA', () => {
    it('returns a DNA object with all required fields', () => {
      const dna = generateDNA()

      expect(dna).toHaveProperty('strengthGene')
      expect(dna).toHaveProperty('intelligenceGene')
      expect(dna).toHaveProperty('agilityGene')
      expect(dna).toHaveProperty('personality')
    })

    it('generates genes in the range [0.8, 1.2]', () => {
      for (let i = 0; i < 100; i++) {
        const dna = generateDNA()
        expect(dna.strengthGene).toBeGreaterThanOrEqual(0.8)
        expect(dna.strengthGene).toBeLessThanOrEqual(1.2)
        expect(dna.intelligenceGene).toBeGreaterThanOrEqual(0.8)
        expect(dna.intelligenceGene).toBeLessThanOrEqual(1.2)
        expect(dna.agilityGene).toBeGreaterThanOrEqual(0.8)
        expect(dna.agilityGene).toBeLessThanOrEqual(1.2)
      }
    })

    it('generates one of the 5 valid personalities', () => {
      const validPersonalities = ['lively', 'quiet', 'foodie', 'aloof', 'curious']

      for (let i = 0; i < 100; i++) {
        const dna = generateDNA()
        expect(validPersonalities).toContain(dna.personality)
      }
    })

    it('can generate all 5 personalities over many calls', () => {
      const seen = new Set<string>()

      for (let i = 0; i < 500; i++) {
        seen.add(generateDNA().personality)
      }

      expect(seen.size).toBe(5)
    })
  })

  describe('applyGene', () => {
    const baseDna: DNA = {
      strengthGene: 1.1,
      intelligenceGene: 0.9,
      agilityGene: 1.2,
      personality: 'curious',
    }

    it('multiplies strength base value by strengthGene', () => {
      const result = applyGene(baseDna, 'strength', 100)
      expect(result).toBe(110)
    })

    it('multiplies intelligence base value by intelligenceGene', () => {
      const result = applyGene(baseDna, 'intelligence', 50)
      expect(result).toBe(45)
    })

    it('multiplies agility base value by agilityGene', () => {
      const result = applyGene(baseDna, 'agility', 80)
      expect(result).toBe(96)
    })

    it('rounds the result to the nearest integer', () => {
      const dna: DNA = {
        strengthGene: 0.83,
        intelligenceGene: 1.0,
        agilityGene: 1.0,
        personality: 'lively',
      }
      const result = applyGene(dna, 'strength', 10)
      expect(result).toBe(8)
    })
  })
})
