import { PRESET_EVENTS, EVENT_WEIGHTS } from '@/data/events'
import type { GameEvent } from '@/types/event'

type Rarity = 'common' | 'rare' | 'key'

const RARITY_ORDER: Rarity[] = ['common', 'rare', 'key']

function pickWeightedRarity(): Rarity {
  const total = EVENT_WEIGHTS.common + EVENT_WEIGHTS.rare + EVENT_WEIGHTS.key
  const roll = Math.random() * total

  if (roll < EVENT_WEIGHTS.common) return 'common'
  if (roll < EVENT_WEIGHTS.common + EVENT_WEIGHTS.rare) return 'rare'
  return 'key'
}

export function generateEvent(
  sceneId: string,
  _petLevel: number,
  _dominantStat: string,
): GameEvent | null {
  const sceneEvents = PRESET_EVENTS.filter((e) => e.sceneId === sceneId)
  if (sceneEvents.length === 0) return null

  const targetRarity = pickWeightedRarity()

  // Try to find an event of the rolled rarity; fall back to lower rarities
  for (const rarity of RARITY_ORDER.slice(RARITY_ORDER.indexOf(targetRarity))) {
    const candidates = sceneEvents.filter((e) => e.rarity === rarity)
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)]!
    }
  }

  // Ultimate fallback: any scene event
  return sceneEvents[Math.floor(Math.random() * sceneEvents.length)]!
}

/**
 * AI-enhanced event generation (stub for future integration).
 */
export async function generateWithAI(
  _sceneId: string,
  _petLevel: number,
  _dominantStat: string,
): Promise<GameEvent | null> {
  return null
}
