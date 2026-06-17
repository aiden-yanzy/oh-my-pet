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
    await savePet();
  }

  async function loadLatestPet() {
    await storageService.init();
    const data = await storageService.getPet('current');
    if (data) {
      pet.value = data as Pet;
    }
  }

  async function savePet() {
    if (pet.value) {
      pet.value.lastActiveAt = Date.now();
      await storageService.setPet({ ...pet.value, id: 'current' });
    }
  }

  function feed(foodType: string) {
    const p = pet.value;
    if (!p) return;
    const effect = FOOD_EFFECTS[foodType];
    if (!effect) return;
    if (effect.health) p.stats.health = Math.min(100, p.stats.health + effect.health);
    if (effect.happiness) p.stats.happiness = Math.min(100, p.stats.happiness + effect.happiness);
    if (effect.experience) p.stats.experience += effect.experience;
    if (effect.stat) {
      const statKey = effect.stat.type as keyof typeof p.stats;
      const gained = applyGene(p.dna, effect.stat.type as 'strength' | 'intelligence' | 'agility', effect.stat.value);
      const currentVal: number = p.stats[statKey] as number;
      (p.stats as Record<string, number>)[statKey] = currentVal + gained;
    }
    checkLevelUp();
    savePet();
  }

  function play(gameType: 'strength' | 'intelligence' | 'agility') {
    const p = pet.value;
    if (!p) return;
    p.stats.happiness = Math.min(100, p.stats.happiness + 15);
    p.stats.experience += 5;
    const gained = applyGene(p.dna, gameType, 2);
    p.stats[gameType] += gained;
    checkLevelUp();
    savePet();
  }

  function rest(durationHours: number) {
    const p = pet.value;
    if (!p) return;
    const recovery = 10 * durationHours;
    p.stats.happiness = Math.min(100, p.stats.happiness + recovery);
    p.stats.health = Math.min(100, p.stats.health + recovery);
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
    await storageService.setPet({} as Pet);
  }

  return { pet, level, experienceToNext, expProgress, availableEvolutions, canEvolve,
    createPet, loadLatestPet, savePet, feed, play, rest, deletePet };
});
