# Oh My Pet MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight, pixel-style virtual pet PWA with infinite evolution, exploration system, and optional AI enhancement.

**Architecture:** Vue 3 SPA with Pinia state management, IndexedDB persistence, Pixi.js rendering, and DeepSeek API for dynamic content generation (cached). Follows TDD with Vitest unit tests and manual testing for game logic.

**Tech Stack:** 
- Base: alexanderop/vue-template (Vue 3 + TypeScript + Pinia + Tailwind v4 + PWA)
- Rendering: Pixi.js 8
- Storage: IndexedDB (primary) / localStorage (fallback)
- AI: DeepSeek V3 API (optional, cached)
- Testing: Vitest + Playwright

---

## Scope Overview

This plan implements the **first phase MVP** (2-3 weeks):
- ✅ Pet system (DNA, stats, evolution with 2 branches)
- ✅ Core interactions (feed, play, rest, explore)
- ✅ Exploration with 2-3 scenes and event generation
- ✅ Daily tasks system
- ✅ Offline mechanism with accumulation
- ✅ AI enhancement (optional: offline summary + event generation with cache)

**Out of scope (Phase 2):**
- Supabase backend and user accounts
- Social features
- Full evolution tree (only 2-3 branches in MVP)
- Complex animations (simple sprite frames only)

---

## File Structure Plan

### Core Application Structure (based on alexanderop/vue-template)

```
oh-my-pet/
├── src/
│   ├── stores/              # Pinia stores
│   │   ├── petStore.ts      # Pet state, stats, DNA, evolution
│   │   ├── gameStore.ts     # Game loop, time system, offline calculation
│   │   ├── taskStore.ts     # Daily tasks state
│   │   ├── exploreStore.ts  # Exploration logs, scenes
│   │   └── inventoryStore.ts # Items and food inventory
│   │
│   ├── composables/         # Vue composables
│   │   ├── useGameLoop.ts   # Game loop and time tick
│   │   ├── usePetRenderer.ts # Pixi.js pet rendering
│   │   └── useOffline.ts    # Offline time calculation
│   │
│   ├── services/            # Business logic
│   │   ├── petService.ts    # Pet logic (evolution, stat changes)
│   │   ├── dnaService.ts    # DNA generation and gene calculations
│   │   ├── evolutionService.ts # Evolution trigger checks
│   │   ├── eventService.ts  # Event generation (preset + AI)
│   │   ├── aiService.ts     # DeepSeek API client
│   │   ├── cacheService.ts  # IndexedDB AI cache manager
│   │   └── storageService.ts # IndexedDB / localStorage abstraction
│   │
│   ├── types/               # TypeScript types
│   │   ├── pet.ts           # Pet, DNA, Stats types
│   │   ├── evolution.ts     # Evolution, Skill types
│   │   ├── event.ts         # Event, Scene types
│   │   ├── task.ts          # Task types
│   │   └── game.ts          # Game state types
│   │
│   ├── data/                # Static data
│   │   ├── foods.ts         # Food definitions
│   │   ├── scenes.ts        # Scene configurations
│   │   ├── events.ts        # Preset event pool
│   │   ├── evolutions.ts    # Evolution tree definitions
│   │   └── tasks.ts         # Daily task templates
│   │
│   ├── components/          # Vue components
│   │   ├── pet/
│   │   │   ├── PetCanvas.vue      # Pixi.js canvas container
│   │   │   ├── PetStats.vue       # Stats display
│   │   │   └── PetProfile.vue     # Pet profile modal
│   │   ├── interaction/
│   │   │   ├── FeedButton.vue     # Feed interaction
│   │   │   ├── PlayMenu.vue       # Play games menu
│   │   │   └── ExploreButton.vue  # Explore trigger
│   │   ├── tasks/
│   │   │   └── DailyTaskList.vue  # Daily tasks UI
│   │   └── logs/
│   │       └── ExploreLogModal.vue # Exploration logs
│   │
│   ├── views/
│   │   └── Home.vue         # Main game view
│   │
│   └── assets/
│       └── sprites/         # Pixel art sprites (placeholder)
│
├── tests/
│   ├── unit/                # Vitest unit tests
│   │   ├── stores/
│   │   ├── services/
│   │   └── composables/
│   └── e2e/                 # Playwright E2E tests
│
└── public/
    └── sprites/             # Production sprite assets
```

---

## Phase 1: Project Setup & Infrastructure

### Task 1: Fork and Setup Base Template

**Files:**
- Clone: `alexanderop/vue-template` → `oh-my-pet/`
- Modify: `package.json`, `vite.config.ts`, `index.html`

- [ ] **Step 1: Clone template repository**

```bash
git clone https://github.com/alexanderop/vue-template.git oh-my-pet
cd oh-my-pet
rm -rf .git
git init
git add .
git commit -m "chore: initial commit from vue-template"
```

- [ ] **Step 2: Update package.json**

```json
{
  "name": "oh-my-pet",
  "version": "0.1.0",
  "description": "Pixel-style virtual pet PWA with infinite evolution",
  "author": "",
  "license": "MIT"
}
```

- [ ] **Step 3: Install dependencies**

```bash
npm install
```

Expected: Dependencies installed successfully

- [ ] **Step 4: Add Pixi.js dependency**

```bash
npm install pixi.js@8
npm install --save-dev @types/pixi.js
```

- [ ] **Step 5: Verify dev server runs**

```bash
npm run dev
```

Expected: Dev server starts on http://localhost:5173

- [ ] **Step 6: Commit setup**

```bash
git add package.json package-lock.json
git commit -m "chore: setup oh-my-pet project with pixi.js"
```

---

### Task 2: TypeScript Type Definitions

**Files:**
- Create: `src/types/pet.ts`
- Create: `src/types/evolution.ts`
- Create: `src/types/event.ts`
- Create: `src/types/task.ts`
- Create: `src/types/game.ts`

- [ ] **Step 1: Create pet types**

Create `src/types/pet.ts`:

```typescript
export interface DNA {
  strengthGene: number;      // 0.8 - 1.2
  intelligenceGene: number;  // 0.8 - 1.2
  agilityGene: number;       // 0.8 - 1.2
  personality: Personality;
}

export type Personality = 'lively' | 'quiet' | 'foodie' | 'aloof' | 'curious';

export interface PetStats {
  // Base stats
  happiness: number;      // 0-100
  health: number;         // 0-100
  experience: number;
  level: number;
  
  // Growth stats
  strength: number;
  intelligence: number;
  agility: number;
  charm: number;
}

export interface PetAppearance {
  formStage: number;        // 0 = base, 1 = first evolution, etc.
  dominantType: 'balanced' | 'strength' | 'intelligence' | 'agility';
  colorScheme: string;
}

export interface Pet {
  id: string;
  name: string;
  createdAt: number;
  lastActiveAt: number;
  
  dna: DNA;
  stats: PetStats;
  appearance: PetAppearance;
  skills: string[];         // Skill IDs
  
  // Cloud sync (Phase 2)
  userId?: string | null;
  syncedAt?: number | null;
}
```

- [ ] **Step 2: Create evolution types**

Create `src/types/evolution.ts`:

```typescript
export interface Skill {
  id: string;
  name: string;
  description: string;
  type: 'passive' | 'interaction' | 'exploration';
  effect: Record<string, number | string>;
}

export interface EvolutionCondition {
  type: 'level' | 'stat' | 'item' | 'event' | 'compound' | 'time' | 'rare';
  params: Record<string, any>;
}

export interface Evolution {
  id: string;
  fromStage: number;
  toStage: number;
  name: string;
  description: string;
  dominantType: 'strength' | 'intelligence' | 'agility' | 'balanced';
  conditions: EvolutionCondition[];
  unlockedSkills?: string[];
}
```

- [ ] **Step 3: Create event types**

Create `src/types/event.ts`:

```typescript
export interface Scene {
  id: string;
  name: string;
  unlockLevel: number;
  theme: 'strength' | 'intelligence' | 'agility' | 'balanced';
}

export interface EventChoice {
  text: string;
  effects: {
    happiness?: number;
    health?: number;
    strength?: number;
    intelligence?: number;
    agility?: number;
    experience?: number;
  };
  item?: string | null;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  sceneId: string;
  rarity: 'common' | 'rare' | 'key';
  choices?: EventChoice[];  // Empty for simple events
  rewards: {
    experience?: number;
    items?: string[];
    stats?: Record<string, number>;
  };
}

export interface ExplorationLog {
  id: string;
  sceneId: string;
  startTime: number;
  endTime: number;
  events: Event[];
  viewed: boolean;
}
```

- [ ] **Step 4: Create task types**

Create `src/types/task.ts`:

```typescript
export interface TaskReward {
  experience: number;
  items?: Array<{ type: string; amount: number }>;
}

export interface DailyTask {
  id: string;
  title: string;
  description: string;
  type: 'feed' | 'play' | 'explore' | 'stat' | 'time';
  target: number;
  progress: number;
  completed: boolean;
  rewards: TaskReward;
}

export interface TaskState {
  dailyTasks: DailyTask[];
  lastRefreshDate: string;  // YYYY-MM-DD
  completedToday: number;
}
```

- [ ] **Step 5: Create game types**

Create `src/types/game.ts`:

```typescript
export interface GameState {
  isPaused: boolean;
  lastTickTime: number;
  totalPlayTime: number;  // seconds
}

export interface OfflineData {
  offlineHours: number;
  explorationCount: number;
  statsChange: Record<string, number>;
  events: Event[];
}
```

- [ ] **Step 6: Run type check**

```bash
npx tsc --noEmit
```

Expected: No type errors

- [ ] **Step 7: Commit types**

```bash
git add src/types/
git commit -m "feat: add TypeScript type definitions for pet, evolution, events, tasks"
```

---

## Phase 2: Storage Layer

### Task 3: IndexedDB Storage Service

**Files:**
- Create: `src/services/storageService.ts`
- Create: `tests/unit/services/storageService.spec.ts`

- [ ] **Step 1: Write storage service test**

Create `tests/unit/services/storageService.spec.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { StorageService } from '@/services/storageService';

describe('StorageService', () => {
  let storage: StorageService;

  beforeEach(async () => {
    storage = new StorageService();
    await storage.init();
  });

  it('should store and retrieve pet data', async () => {
    const petData = {
      id: 'pet_1',
      name: 'Test Pet',
      stats: { happiness: 100, health: 100, level: 1 }
    };

    await storage.setPet(petData);
    const retrieved = await storage.getPet('pet_1');

    expect(retrieved).toEqual(petData);
  });

  it('should fallback to localStorage if IndexedDB fails', async () => {
    // Test will verify localStorage fallback
    const storageWithFallback = new StorageService(true); // force fallback
    
    await storageWithFallback.setPet({ id: 'test', name: 'Fallback' });
    const data = await storageWithFallback.getPet('test');
    
    expect(data.name).toBe('Fallback');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npm run test:unit -- storageService.spec.ts
```

Expected: FAIL - StorageService not found

- [ ] **Step 3: Implement storage service**

Create `src/services/storageService.ts`:

```typescript
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'oh-my-pet-db';
const DB_VERSION = 1;

export class StorageService {
  private db: IDBPDatabase | null = null;
  private useFallback: boolean;

  constructor(forceFallback = false) {
    this.useFallback = forceFallback;
  }

  async init(): Promise<void> {
    if (this.useFallback) {
      return;
    }

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          // Create object stores
          if (!db.objectStoreNames.contains('pets')) {
            db.createObjectStore('pets', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('tasks')) {
            db.createObjectStore('tasks', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('explorations')) {
            db.createObjectStore('explorations', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('aiCache')) {
            db.createObjectStore('aiCache', { keyPath: 'id' });
          }
        },
      });
    } catch (error) {
      console.warn('IndexedDB init failed, falling back to localStorage', error);
      this.useFallback = true;
    }
  }

  async setPet(data: any): Promise<void> {
    if (this.useFallback || !this.db) {
      localStorage.setItem(`pet_${data.id}`, JSON.stringify(data));
      return;
    }

    await this.db.put('pets', data);
  }

  async getPet(id: string): Promise<any> {
    if (this.useFallback || !this.db) {
      const data = localStorage.getItem(`pet_${id}`);
      return data ? JSON.parse(data) : null;
    }

    return await this.db.get('pets', id);
  }

  async setTasks(data: any): Promise<void> {
    if (this.useFallback || !this.db) {
      localStorage.setItem('tasks', JSON.stringify(data));
      return;
    }

    await this.db.put('tasks', { id: 'daily', ...data });
  }

  async getTasks(): Promise<any> {
    if (this.useFallback || !this.db) {
      const data = localStorage.getItem('tasks');
      return data ? JSON.parse(data) : null;
    }

    return await this.db.get('tasks', 'daily');
  }

  // Cache operations for AI responses
  async getFromCache(key: string): Promise<any> {
    if (this.useFallback || !this.db) {
      const data = localStorage.getItem(`cache_${key}`);
      return data ? JSON.parse(data) : null;
    }

    const cached = await this.db.get('aiCache', key);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.content;
    }
    return null;
  }

  async setCache(key: string, content: any, ttlDays = 7): Promise<void> {
    const expiresAt = Date.now() + ttlDays * 24 * 60 * 60 * 1000;

    if (this.useFallback || !this.db) {
      localStorage.setItem(`cache_${key}`, JSON.stringify({ content, expiresAt }));
      return;
    }

    await this.db.put('aiCache', {
      id: key,
      content,
      createdAt: Date.now(),
      expiresAt,
      hitCount: 0,
    });
  }
}
```

- [ ] **Step 4: Install idb dependency**

```bash
npm install idb
```

- [ ] **Step 5: Run tests**

```bash
npm run test:unit -- storageService.spec.ts
```

Expected: PASS

- [ ] **Step 6: Commit storage service**

```bash
git add src/services/storageService.ts tests/unit/services/storageService.spec.ts package.json
git commit -m "feat: add IndexedDB storage service with localStorage fallback"
```

---

## Phase 3: Pet Core Logic

### Task 4: DNA Service

**Files:**
- Create: `src/services/dnaService.ts`
- Create: `tests/unit/services/dnaService.spec.ts`

- [ ] **Step 1: Write DNA generation test**

Create `tests/unit/services/dnaService.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { DNAService } from '@/services/dnaService';

describe('DNAService', () => {
  it('should generate DNA with genes in range 0.8-1.2', () => {
    const dna = DNAService.generateDNA();

    expect(dna.strengthGene).toBeGreaterThanOrEqual(0.8);
    expect(dna.strengthGene).toBeLessThanOrEqual(1.2);
    expect(dna.intelligenceGene).toBeGreaterThanOrEqual(0.8);
    expect(dna.intelligenceGene).toBeLessThanOrEqual(1.2);
    expect(dna.agilityGene).toBeGreaterThanOrEqual(0.8);
    expect(dna.agilityGene).toBeLessThanOrEqual(1.2);
  });

  it('should generate one of 5 personalities', () => {
    const dna = DNAService.generateDNA();
    const validPersonalities = ['lively', 'quiet', 'foodie', 'aloof', 'curious'];

    expect(validPersonalities).toContain(dna.personality);
  });

  it('should apply gene multiplier to stat gains', () => {
    const dna = { strengthGene: 1.2, intelligenceGene: 0.8, agilityGene: 1.0, personality: 'lively' };
    
    const strengthGain = DNAService.applyGene(dna, 'strength', 10);
    const intelligenceGain = DNAService.applyGene(dna, 'intelligence', 10);

    expect(strengthGain).toBe(12);  // 10 * 1.2
    expect(intelligenceGain).toBe(8); // 10 * 0.8
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- dnaService.spec.ts
```

Expected: FAIL - DNAService not found

- [ ] **Step 3: Implement DNA service**

Create `src/services/dnaService.ts`:

```typescript
import type { DNA, Personality } from '@/types/pet';

const PERSONALITIES: Personality[] = ['lively', 'quiet', 'foodie', 'aloof', 'curious'];

export class DNAService {
  static generateDNA(): DNA {
    return {
      strengthGene: this.randomGene(),
      intelligenceGene: this.randomGene(),
      agilityGene: this.randomGene(),
      personality: this.randomPersonality(),
    };
  }

  private static randomGene(): number {
    // Generate value between 0.8 and 1.2
    return 0.8 + Math.random() * 0.4;
  }

  private static randomPersonality(): Personality {
    return PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
  }

  static applyGene(dna: DNA, statType: 'strength' | 'intelligence' | 'agility', baseValue: number): number {
    const geneMap = {
      strength: dna.strengthGene,
      intelligence: dna.intelligenceGene,
      agility: dna.agilityGene,
    };

    return Math.round(baseValue * geneMap[statType]);
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- dnaService.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit DNA service**

```bash
git add src/services/dnaService.ts tests/unit/services/dnaService.spec.ts
git commit -m "feat: add DNA generation and gene calculation service"
```

---

### Task 5: Pet Store (Pinia)

**Files:**
- Create: `src/stores/petStore.ts`
- Create: `tests/unit/stores/petStore.spec.ts`

- [ ] **Step 1: Write pet store test**

Create `tests/unit/stores/petStore.spec.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { usePetStore } from '@/stores/petStore';

describe('petStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should initialize with no pet', () => {
    const store = usePetStore();
    expect(store.pet).toBeNull();
  });

  it('should create a new pet with DNA', () => {
    const store = usePetStore();
    store.createPet('TestPet');

    expect(store.pet).not.toBeNull();
    expect(store.pet?.name).toBe('TestPet');
    expect(store.pet?.dna.strengthGene).toBeGreaterThan(0);
    expect(store.pet?.stats.level).toBe(1);
  });

  it('should feed pet and increase health', () => {
    const store = usePetStore();
    store.createPet('TestPet');
    
    const initialHealth = store.pet!.stats.health;
    store.feed('meat');
    
    expect(store.pet!.stats.health).toBeGreaterThan(initialHealth);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- petStore.spec.ts
```

Expected: FAIL - usePetStore not found

- [ ] **Step 3: Implement pet store**

Create `src/stores/petStore.ts`:

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Pet, PetStats } from '@/types/pet';
import { DNAService } from '@/services/dnaService';
import { StorageService } from '@/services/storageService';

const storage = new StorageService();

export const usePetStore = defineStore('pet', () => {
  const pet = ref<Pet | null>(null);

  // Computed
  const level = computed(() => pet.value?.stats.level ?? 1);
  const experienceToNext = computed(() => {
    const base = 100;
    const currentLevel = level.value;
    return Math.floor(base * Math.pow(1.5, currentLevel - 1));
  });

  // Actions
  async function createPet(name: string) {
    const dna = DNAService.generateDNA();
    
    pet.value = {
      id: `pet_${Date.now()}`,
      name,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      dna,
      stats: {
        happiness: 100,
        health: 100,
        experience: 0,
        level: 1,
        strength: 0,
        intelligence: 0,
        agility: 0,
        charm: 0,
      },
      appearance: {
        formStage: 0,
        dominantType: 'balanced',
        colorScheme: 'default',
      },
      skills: [],
    };

    await savePet();
  }

  async function loadPet(id: string) {
    await storage.init();
    const data = await storage.getPet(id);
    if (data) {
      pet.value = data;
    }
  }

  async function savePet() {
    if (pet.value) {
      pet.value.lastActiveAt = Date.now();
      await storage.setPet(pet.value);
    }
  }

  function feed(foodType: 'meat' | 'vegetable' | 'snack' | 'special') {
    if (!pet.value) return;

    const foodEffects = {
      meat: { health: 20, strength: 3, experience: 5 },
      vegetable: { health: 15, intelligence: 3, experience: 5 },
      snack: { health: 5, happiness: 10, agility: 2, experience: 3 },
      special: { health: 30, experience: 10 },
    };

    const effects = foodEffects[foodType];
    
    if (effects.health) pet.value.stats.health = Math.min(100, pet.value.stats.health + effects.health);
    if (effects.happiness) pet.value.stats.happiness = Math.min(100, pet.value.stats.happiness + effects.happiness);
    if (effects.experience) pet.value.stats.experience += effects.experience;
    
    // Apply DNA genes to stat gains
    if (effects.strength) {
      pet.value.stats.strength += DNAService.applyGene(pet.value.dna, 'strength', effects.strength);
    }
    if (effects.intelligence) {
      pet.value.stats.intelligence += DNAService.applyGene(pet.value.dna, 'intelligence', effects.intelligence);
    }
    if (effects.agility) {
      pet.value.stats.agility += DNAService.applyGene(pet.value.dna, 'agility', effects.agility);
    }

    checkLevelUp();
    savePet();
  }

  function play(gameType: 'strength' | 'intelligence' | 'agility') {
    if (!pet.value) return;

    pet.value.stats.happiness = Math.min(100, pet.value.stats.happiness + 15);
    pet.value.stats.experience += 5;

    const statGain = 2;
    pet.value.stats[gameType] += DNAService.applyGene(pet.value.dna, gameType, statGain);

    checkLevelUp();
    savePet();
  }

  function checkLevelUp() {
    if (!pet.value) return;

    while (pet.value.stats.experience >= experienceToNext.value) {
      pet.value.stats.experience -= experienceToNext.value;
      pet.value.stats.level += 1;
      console.log(`Level up! Now level ${pet.value.stats.level}`);
      
      // Check evolution conditions here (Task will be added later)
    }
  }

  return {
    pet,
    level,
    experienceToNext,
    createPet,
    loadPet,
    savePet,
    feed,
    play,
  };
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- petStore.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit pet store**

```bash
git add src/stores/petStore.ts tests/unit/stores/petStore.spec.ts
git commit -m "feat: add pet store with DNA-based stat calculations"
```

---

## Phase 4: Static Data & Event System

### Task 6: Static Data Definitions

**Files:**
- Create: `src/data/foods.ts`
- Create: `src/data/scenes.ts`
- Create: `src/data/events.ts`

- [ ] **Step 1: Create food definitions**

Create `src/data/foods.ts`:

```typescript
export interface FoodItem {
  id: string;
  name: string;
  type: 'meat' | 'vegetable' | 'snack' | 'special';
  description: string;
  icon: string;
}

export const FOODS: FoodItem[] = [
  { id: 'steak', name: '牛排', type: 'meat', description: '增加力量', icon: '🥩' },
  { id: 'chicken', name: '鸡肉', type: 'meat', description: '增加力量', icon: '🍗' },
  { id: 'apple', name: '苹果', type: 'vegetable', description: '增加智力', icon: '🍎' },
  { id: 'carrot', name: '胡萝卜', type: 'vegetable', description: '增加智力', icon: '🥕' },
  { id: 'cookie', name: '饼干', type: 'snack', description: '增加敏捷', icon: '🍪' },
  { id: 'candy', name: '糖果', type: 'snack', description: '增加敏捷', icon: '🍬' },
];
```

- [ ] **Step 2: Create scene definitions**

Create `src/data/scenes.ts`:

```typescript
import type { Scene } from '@/types/event';

export const SCENES: Scene[] = [
  {
    id: 'grassland',
    name: '草原',
    unlockLevel: 0,
    theme: 'balanced',
  },
  {
    id: 'forest',
    name: '森林',
    unlockLevel: 10,
    theme: 'intelligence',
  },
  {
    id: 'mountain',
    name: '山地',
    unlockLevel: 15,
    theme: 'strength',
  },
];
```

- [ ] **Step 3: Create preset events**

Create `src/data/events.ts`:

```typescript
import type { Event } from '@/types/event';

export const PRESET_EVENTS: Event[] = [
  // Grassland - Common
  {
    id: 'grassland_food_1',
    title: '发现浆果',
    description: '在草丛中发现了新鲜的浆果',
    sceneId: 'grassland',
    rarity: 'common',
    rewards: {
      items: ['apple'],
      experience: 10,
    },
  },
  {
    id: 'grassland_animal_1',
    title: '遇到小兔子',
    description: '遇到了一只可爱的小兔子，一起玩耍了一会儿',
    sceneId: 'grassland',
    rarity: 'common',
    rewards: {
      experience: 10,
      stats: { happiness: 10, charm: 1 },
    },
  },
  {
    id: 'grassland_exercise_1',
    title: '晨跑',
    description: '在清晨的草原上跑了一圈，感觉精力充沛',
    sceneId: 'grassland',
    rarity: 'common',
    rewards: {
      experience: 10,
      stats: { health: 5, agility: 2 },
    },
  },

  // Forest - Common
  {
    id: 'forest_mushroom_1',
    title: '采蘑菇',
    description: '在树下找到了几朵新鲜的蘑菇',
    sceneId: 'forest',
    rarity: 'common',
    rewards: {
      items: ['carrot'],
      experience: 15,
    },
  },
  {
    id: 'forest_puzzle_1',
    title: '解谜',
    description: '发现了一个古老的谜题石碑，成功解开了！',
    sceneId: 'forest',
    rarity: 'rare',
    rewards: {
      experience: 25,
      stats: { intelligence: 5 },
    },
  },

  // Mountain - Common
  {
    id: 'mountain_climb_1',
    title: '攀岩',
    description: '成功攀爬上了一处陡峭的山壁',
    sceneId: 'mountain',
    rarity: 'common',
    rewards: {
      experience: 15,
      stats: { strength: 3, health: 5 },
    },
  },

  // Rare events
  {
    id: 'treasure_chest',
    title: '发现宝箱',
    description: '找到了一个神秘的宝箱！',
    sceneId: 'grassland',
    rarity: 'rare',
    rewards: {
      experience: 50,
      items: ['special'],
    },
  },
];

// Event weights by rarity
export const EVENT_WEIGHTS = {
  common: 70,
  rare: 25,
  key: 5,
};
```

- [ ] **Step 4: Commit static data**

```bash
git add src/data/
git commit -m "feat: add static data definitions for foods, scenes, and events"
```

---

### Task 7: Event Generation Service

**Files:**
- Create: `src/services/eventService.ts`
- Create: `tests/unit/services/eventService.spec.ts`

- [ ] **Step 1: Write event service test**

Create `tests/unit/services/eventService.spec.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { EventService } from '@/services/eventService';

describe('EventService', () => {
  it('should generate event from preset pool', () => {
    const event = EventService.generateEvent('grassland', 1, 'balanced');
    
    expect(event).toBeDefined();
    expect(event.sceneId).toBe('grassland');
  });

  it('should respect rarity weights', () => {
    const results = { common: 0, rare: 0, key: 0 };
    
    for (let i = 0; i < 1000; i++) {
      const event = EventService.generateEvent('grassland', 1, 'balanced');
      results[event.rarity]++;
    }

    // Common should be ~70%, rare ~25%, key ~5%
    expect(results.common).toBeGreaterThan(600);
    expect(results.rare).toBeGreaterThan(150);
    expect(results.key).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- eventService.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement event service**

Create `src/services/eventService.ts`:

```typescript
import type { Event } from '@/types/event';
import { PRESET_EVENTS, EVENT_WEIGHTS } from '@/data/events';

export class EventService {
  static generateEvent(
    sceneId: string,
    petLevel: number,
    dominantStat: string
  ): Event {
    // Filter events for this scene
    const sceneEvents = PRESET_EVENTS.filter(e => e.sceneId === sceneId);

    // Pick rarity based on weights
    const rarity = this.pickRarity();

    // Filter by rarity
    const rarityEvents = sceneEvents.filter(e => e.rarity === rarity);

    if (rarityEvents.length === 0) {
      // Fallback to common
      const commonEvents = sceneEvents.filter(e => e.rarity === 'common');
      return commonEvents[Math.floor(Math.random() * commonEvents.length)];
    }

    return rarityEvents[Math.floor(Math.random() * rarityEvents.length)];
  }

  private static pickRarity(): 'common' | 'rare' | 'key' {
    const roll = Math.random() * 100;
    
    if (roll < EVENT_WEIGHTS.common) {
      return 'common';
    } else if (roll < EVENT_WEIGHTS.common + EVENT_WEIGHTS.rare) {
      return 'rare';
    } else {
      return 'key';
    }
  }

  static async generateWithAI(
    sceneId: string,
    petLevel: number,
    dominantStat: string,
    personality: string,
    recentEvents: string[]
  ): Promise<Event | null> {
    // AI generation will be implemented in Task 15
    // For now, return null to fallback to preset
    return null;
  }
}
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- eventService.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit event service**

```bash
git add src/services/eventService.ts tests/unit/services/eventService.spec.ts
git commit -m "feat: add event generation service with preset pool"
```

---

## Phase 5: Exploration & Tasks

### Task 8: Exploration Store

**Files:**
- Create: `src/stores/exploreStore.ts`
- Create: `tests/unit/stores/exploreStore.spec.ts`

- [ ] **Step 1: Write exploration store test**

Create `tests/unit/stores/exploreStore.spec.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useExploreStore } from '@/stores/exploreStore';

describe('exploreStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('should start exploration', () => {
    const store = useExploreStore();
    store.startExploration('grassland');

    expect(store.isExploring).toBe(true);
    expect(store.currentScene).toBe('grassland');
  });

  it('should generate exploration log after completion', () => {
    vi.useFakeTimers();
    const store = useExploreStore();
    
    store.startExploration('grassland');
    
    // Fast-forward 10 minutes
    vi.advanceTimersByTime(10 * 60 * 1000);
    
    expect(store.logs.length).toBeGreaterThan(0);
    expect(store.isExploring).toBe(false);
    
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run test to verify failure**

```bash
npm run test:unit -- exploreStore.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement exploration store**

Create `src/stores/exploreStore.ts`:

```typescript
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { ExplorationLog, Event } from '@/types/event';
import { EventService } from '@/services/eventService';
import { usePetStore } from './petStore';

export const useExploreStore = defineStore('explore', () => {
  const logs = ref<ExplorationLog[]>([]);
  const isExploring = ref(false);
  const currentScene = ref<string | null>(null);
  const exploreStartTime = ref<number | null>(null);

  const petStore = usePetStore();

  const unviewedLogs = computed(() => logs.value.filter(log => !log.viewed));

  function startExploration(sceneId: string) {
    if (isExploring.value || !petStore.pet) return;

    isExploring.value = true;
    currentScene.value = sceneId;
    exploreStartTime.value = Date.now();

    // Duration: 5-15 minutes (random)
    const duration = (5 + Math.random() * 10) * 60 * 1000;

    setTimeout(() => {
      completeExploration(sceneId, duration);
    }, duration);
  }

  function completeExploration(sceneId: string, duration: number) {
    if (!petStore.pet) return;

    const startTime = exploreStartTime.value || Date.now();
    const endTime = startTime + duration;

    // Generate 1-3 events
    const eventCount = 1 + Math.floor(Math.random() * 3);
    const events: Event[] = [];

    for (let i = 0; i < eventCount; i++) {
      const event = EventService.generateEvent(
        sceneId,
        petStore.pet.stats.level,
        petStore.pet.appearance.dominantType
      );
      events.push(event);
    }

    // Apply rewards
    events.forEach(event => {
      if (event.rewards.experience) {
        petStore.pet!.stats.experience += event.rewards.experience;
      }
      if (event.rewards.stats) {
        Object.entries(event.rewards.stats).forEach(([stat, value]) => {
          if (stat in petStore.pet!.stats) {
            (petStore.pet!.stats as any)[stat] += value;
          }
        });
      }
      // Items will be handled by inventory store (Task 9)
    });

    // Create log
    const log: ExplorationLog = {
      id: `explore_${Date.now()}`,
      sceneId,
      startTime,
      endTime,
      events,
      viewed: false,
    };

    logs.value.unshift(log);

    // Keep only last 50 logs
    if (logs.value.length > 50) {
      logs.value = logs.value.slice(0, 50);
    }

    isExploring.value = false;
    currentScene.value = null;
    exploreStartTime.value = null;

    petStore.savePet();
  }

  function markAsViewed(logId: string) {
    const log = logs.value.find(l => l.id === logId);
    if (log) {
      log.viewed = true;
    }
  }

  function generateOfflineExplorations(offlineHours: number, sceneId: string) {
    const explorationsCount = Math.floor(offlineHours / 2); // Every 2 hours
    const maxExplorations = Math.min(explorationsCount, 84); // Max 7 days worth

    for (let i = 0; i < maxExplorations; i++) {
      const duration = (5 + Math.random() * 10) * 60 * 1000;
      completeExploration(sceneId, duration);
    }
  }

  return {
    logs,
    isExploring,
    currentScene,
    unviewedLogs,
    startExploration,
    markAsViewed,
    generateOfflineExplorations,
  };
});
```

- [ ] **Step 4: Run tests**

```bash
npm run test:unit -- exploreStore.spec.ts
```

Expected: PASS

- [ ] **Step 5: Commit exploration store**

```bash
git add src/stores/exploreStore.ts tests/unit/stores/exploreStore.spec.ts
git commit -m "feat: add exploration store with offline exploration generation"
```

---

## Summary & Next Steps

**实现计划已包含核心任务：**

✅ **Phase 1: 项目设置** (Tasks 1-2)
- Fork alexanderop/vue-template
- TypeScript类型定义

✅ **Phase 2: 存储层** (Task 3)
- IndexedDB/localStorage抽象层

✅ **Phase 3: 宠物核心逻辑** (Tasks 4-5)
- DNA系统
- Pet Store (Pinia)

✅ **Phase 4: 事件系统** (Tasks 6-7)
- 静态数据（食物、场景、事件）
- 事件生成服务

✅ **Phase 5: 探索系统** (Task 8)
- 探索Store
- 离线探索生成

**剩余任务（概述，详细步骤类似上述模式）：**

- **Task 9**: Inventory Store（道具管理）
- **Task 10**: Task Store（每日任务）
- **Task 11**: Game Store（游戏循环、离线计算）
- **Task 12**: Evolution Service（进化判定）
- **Task 13**: Pixi.js渲染层（宠物动画）
- **Task 14**: Vue组件（UI界面）
- **Task 15**: AI Service（DeepSeek API + 缓存）
- **Task 16**: PWA配置优化
- **Task 17**: E2E测试
- **Task 18**: 最终集成与验证

**总预估时间：2-3周（全职开发）**

---

## 执行方式选择

计划已保存到 `docs/superpowers/plans/2026-06-16-mvp-implementation.md`。

**两种执行选项：**

**1. Subagent-Driven（推荐）** - 每个任务派发新的子代理，任务间审查，快速迭代

**2. Inline Execution** - 在当前会话中使用 executing-plans 技能批量执行，带检查点审查

**选择哪种方式？**

