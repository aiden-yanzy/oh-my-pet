import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pet } from '@/types/pet';
import { generateDNA, applyGene } from '@/services/dnaService';
import { storageService } from '@/services/storageService';
import { EVOLUTIONS } from '@/data/evolutions';
import { FOOD_EFFECTS } from '@/data/foods';
import { checkEvolution, getNextEvolutions, unlockSkill } from '@/services/evolutionService';

export const usePetStore = defineStore('pet', () => {
  const pet = ref<Pet | null>(null);

  // Tamagotchi-style runtime state (not persisted)
  const poopCount = ref(0);
  const isSleeping = ref(false);
  const isSick = ref(false);
  const feedSinceLastPoop = ref(0);
  const moodAnim = ref<'idle' | 'eating' | 'happy' | 'sleeping' | 'sick' | 'poop'>('idle');

  const level = computed(() => pet.value?.stats.level ?? 1);
  const experienceToNext = computed(() => {
    if (!pet.value) return 100;
    return Math.floor(100 * Math.pow(1.5, pet.value.stats.level - 1));
  });
  const expProgress = computed(() => {
    if (!pet.value) return 0;
    return pet.value.stats.experience / experienceToNext.value;
  });
  const availableEvolutions = computed(() => {
    if (!pet.value) return [];
    return getNextEvolutions(pet.value, EVOLUTIONS);
  });
  const canEvolve = computed(() => {
    if (!pet.value) return false;
    return checkEvolution(pet.value, EVOLUTIONS) !== null;
  });
  const isDirty = computed(() => poopCount.value > 0);
  const moodText = computed(() => {
    if (isSick.value) return '😷 生病了';
    if (isDirty.value) return '💩 脏脏的';
    if (isSleeping.value) return '💤 睡觉中';
    if (moodAnim.value === 'eating') return '🍽️ 吃东西';
    if ((pet.value?.stats.happiness ?? 100) > 70) return '😊 开心';
    if ((pet.value?.stats.happiness ?? 100) > 40) return '😐 一般';
    return '😞 不开心';
  });

  async function createPet(name: string) {
    const dna = generateDNA();
    const newPet: Pet = {
      id: `pet_${Date.now()}`,
      name,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      dna,
      stats: { happiness: 100, health: 100, experience: 0, level: 1, strength: 0, intelligence: 0, agility: 0, charm: 0 },
      appearance: { formStage: 0, dominantType: 'balanced', colorScheme: 'default' },
      skills: [],
    };
    pet.value = newPet;
    resetState();
    await savePet();
  }

  function resetState() {
    poopCount.value = 0;
    isSleeping.value = false;
    isSick.value = false;
    feedSinceLastPoop.value = 0;
    moodAnim.value = 'idle';
  }

  async function loadLatestPet() {
    await storageService.init();
    const data = await storageService.getPet('current');
    if (data) {
      pet.value = data as Pet;
      resetState();
    }
  }

  async function savePet() {
    if (pet.value) {
      pet.value.lastActiveAt = Date.now();
      await storageService.setPet({ ...pet.value, id: 'current' });
    }
  }

  /**
   * Feed the pet. Every 3 feeds produces a poop.
   * No cooldown — consequences instead.
   */
  function feed(foodType?: string) {
    const p = pet.value;
    if (!p || isSleeping.value || isSick.value) return;
    // Cycle through food types if not specified
    const types: Array<'meat' | 'vegetable' | 'snack'> = ['meat', 'vegetable', 'snack'];
    const type: 'meat' | 'vegetable' | 'snack' = foodType
      ? (foodType as 'meat' | 'vegetable' | 'snack')
      : types[Math.floor(Math.random() * types.length)]!;
    const effect = FOOD_EFFECTS[type];
    if (!effect) return;

    if (effect.health) p.stats.health = Math.min(100, p.stats.health + effect.health);
    if (effect.happiness) p.stats.happiness = Math.min(100, p.stats.happiness + effect.happiness);
    if (effect.experience) p.stats.experience += effect.experience;
    if (effect.stat) {
      const statKey = effect.stat.type;
      const gained = applyGene(p.dna, statKey as 'strength' | 'intelligence' | 'agility', effect.stat.value);
      const currentVal = (p.stats as Record<string, number>)[statKey] ?? 0;
      (p.stats as Record<string, number>)[statKey] = currentVal + gained;
    }

    // Poop mechanism: every 3 feeds = 1 poop
    feedSinceLastPoop.value++;
    if (feedSinceLastPoop.value >= 3) {
      poopCount.value++;
      feedSinceLastPoop.value = 0;
    }

    moodAnim.value = 'eating';
    setTimeout(() => { moodAnim.value = 'idle'; }, 2000);
    checkLevelUp();
    savePet();
  }

  /**
   * Play a random game. No cooldown.
   */
  function play(gameType?: 'strength' | 'intelligence' | 'agility') {
    const p = pet.value;
    if (!p || isSleeping.value || isSick.value) return;
    const types: Array<'strength' | 'intelligence' | 'agility'> = ['strength', 'intelligence', 'agility'];
    const type: 'strength' | 'intelligence' | 'agility' = gameType || types[Math.floor(Math.random() * types.length)]!;
    p.stats.happiness = Math.min(100, p.stats.happiness + 15);
    p.stats.experience += 5;
    const gained = applyGene(p.dna, type, 2);
    p.stats[type] += gained;

    moodAnim.value = 'happy';
    setTimeout(() => { moodAnim.value = 'idle'; }, 1500);
    checkLevelUp();
    savePet();
  }

  /**
   * Toggle sleep on/off. When sleeping, stats recover slowly in game loop.
   */
  function toggleSleep() {
    const p = pet.value;
    if (!p || isSick.value) return;
    isSleeping.value = !isSleeping.value;
    if (isSleeping.value) {
      moodAnim.value = 'sleeping';
    } else {
      moodAnim.value = 'idle';
    }
  }

  /**
   * Clean poop. No cooldown.
   */
  function cleanPoop() {
    if (poopCount.value <= 0) return;
    poopCount.value = Math.max(0, poopCount.value - 1);
    if (poopCount.value === 0) {
      // If was sick due to poop, recover
      if (isSick.value && (pet.value?.stats.health ?? 0) >= 30) {
        isSick.value = false;
      }
    }
    if (moodAnim.value === 'sick' || moodAnim.value === 'poop') {
      moodAnim.value = 'idle';
    }
  }

  /**
   * Give medicine when sick.
   */
  function healPet() {
    if (!pet.value || !isSick.value) return;
    pet.value.stats.health = Math.min(100, pet.value.stats.health + 30);
    isSick.value = false;
    moodAnim.value = 'happy';
    setTimeout(() => { moodAnim.value = 'idle'; }, 1500);
    savePet();
  }

  /**
   * Called by game loop every minute.
   * Handles: poop aging → sickness, sleeping recovery
   */
  function gameTick() {
    const p = pet.value;
    if (!p) return;

    // Sleeping recovery
    if (isSleeping.value) {
      p.stats.happiness = Math.min(100, p.stats.happiness + 2);
      p.stats.health = Math.min(100, p.stats.health + 2);
    }

    // Poop → sickness if ignored too long
    if (poopCount.value > 0 && !isSick.value) {
      // Each tick with poop causes slight health loss
      p.stats.health = Math.max(0, p.stats.health - 3 * poopCount.value);
      if (p.stats.health < 20) {
        isSick.value = true;
        moodAnim.value = 'sick';
      } else if (poopCount.value > 0) {
        moodAnim.value = 'poop';
      }
    }

    // Happy/hunger decay over time
    p.stats.happiness = Math.max(0, p.stats.happiness - 1);
    p.stats.health = Math.max(0, p.stats.health - 1);

    // Natural recovery when not sleeping and not sick
    if (!isSleeping.value && !isSick.value && poopCount.value === 0) {
      p.stats.happiness = Math.min(100, p.stats.happiness + 0.5);
    }

    savePet();
  }

  function checkLevelUp() {
    const p = pet.value;
    if (!p) return;
    while (p.stats.experience >= experienceToNext.value) {
      p.stats.experience -= experienceToNext.value;
      p.stats.level += 1;
      const evolution = checkEvolution(p, EVOLUTIONS);
      if (evolution) {
        applyEvolution(evolution);
      }
    }
  }

  function applyEvolution(evolution: typeof EVOLUTIONS[number]) {
    const p = pet.value;
    if (!p) return;
    p.appearance.formStage = evolution.toStage;
    p.appearance.dominantType = evolution.dominantType;
    if (evolution.unlockedSkills) {
      evolution.unlockedSkills.forEach(skillId => {
        unlockSkill(p, skillId);
      });
    }
  }

  async function deletePet() {
    pet.value = null;
    resetState();
    await storageService.setPet({} as Pet);
  }

  return {
    pet, level, experienceToNext, expProgress, availableEvolutions, canEvolve,
    poopCount, isSleeping, isSick, isDirty, moodAnim, moodText,
    createPet, loadLatestPet, savePet,
    feed, play, toggleSleep, cleanPoop, healPet, gameTick, deletePet,
  };
});
