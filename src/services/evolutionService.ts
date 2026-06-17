import type { Pet, PetStats } from '@/types/pet'
import type { Evolution, EvolutionCondition } from '@/types/evolution'

function meetsCondition(pet: Pet, condition: EvolutionCondition): boolean {
  switch (condition.type) {
    case 'level': {
      const minLevel = condition.params.minLevel as number
      return pet.stats.level >= minLevel
    }

    case 'stat': {
      const stat = condition.params.stat as keyof PetStats
      const minValue = condition.params.minValue as number
      const value = pet.stats[stat]
      return value !== undefined && value >= minValue
    }

    case 'compound': {
      const subConditions = condition.params.subConditions as EvolutionCondition[] | undefined
      if (!subConditions) return false
      return subConditions.every((sub) => meetsCondition(pet, sub))
    }

    case 'item':
    case 'event':
    case 'time':
    case 'rare':
      // Future implementation — not yet supported, skip.
      return false

    default:
      return false
  }
}

function meetsAllConditions(pet: Pet, conditions: EvolutionCondition[]): boolean {
  return conditions.every((c) => meetsCondition(pet, c))
}

/**
 * Checks all evolution conditions and returns the first evolution whose
 * conditions are all met and whose `fromStage` matches the pet's current
 * form stage.
 */
export function checkEvolution(pet: Pet, allEvolutions: Evolution[]): Evolution | null {
  for (const evo of allEvolutions) {
    if (evo.fromStage !== pet.appearance.formStage) continue
    if (meetsAllConditions(pet, evo.conditions)) {
      return evo
    }
  }
  return null
}

/**
 * Returns all evolutions whose conditions are fully met (regardless of
 * fromStage).
 */
export function getAvailableEvolutions(
  pet: Pet,
  allEvolutions: Evolution[],
): Evolution[] {
  return allEvolutions.filter((evo) => meetsAllConditions(pet, evo.conditions))
}

/**
 * Returns all evolutions that match the pet's current formStage
 * (regardless of whether conditions are met).
 */
export function getNextEvolutions(
  pet: Pet,
  allEvolutions: Evolution[],
): Evolution[] {
  return allEvolutions.filter(
    (evo) => evo.fromStage === pet.appearance.formStage,
  )
}

/**
 * Adds a skill to the pet's skill list if not already present.
 * Returns a new pet object (immutable update).
 */
export function unlockSkill(pet: Pet, skillId: string): Pet {
  if (pet.skills.includes(skillId)) return pet
  return {
    ...pet,
    skills: [...pet.skills, skillId],
  }
}
