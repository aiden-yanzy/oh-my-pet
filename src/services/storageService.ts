import { openDB, type IDBPDatabase } from 'idb'
import type { Pet } from '@/types/pet'
import type { TaskState } from '@/types/task'
import type { ExplorationLog } from '@/types/event'
import type { Inventory } from '@/types/inventory'

const DB_NAME = 'oh-my-pet'
const DB_VERSION = 1

const LS_PREFIX = 'oh-my-pet:'

interface CacheEntry<T> {
  key: string
  data: T
  timestamp: number
  ttl: number
}

function lsSet(key: string, value: unknown): void {
  localStorage.setItem(LS_PREFIX + key, JSON.stringify(value))
}

function lsGet<T>(key: string): T | undefined {
  const raw = localStorage.getItem(LS_PREFIX + key)
  if (raw === null) return undefined
  try {
    return JSON.parse(raw) as T
  } catch {
    return undefined
  }
}

function lsRemove(key: string): void {
  localStorage.removeItem(LS_PREFIX + key)
}

class StorageService {
  private db: IDBPDatabase | null = null
  private _fallback = false

  get fallback(): boolean {
    return this._fallback
  }

  async init(): Promise<void> {
    if (typeof indexedDB === 'undefined') {
      this._fallback = true
      return
    }

    try {
      this.db = await openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('pet')) {
            db.createObjectStore('pet', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('tasks')) {
            db.createObjectStore('tasks', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('cache')) {
            db.createObjectStore('cache', { keyPath: 'key' })
          }
          if (!db.objectStoreNames.contains('explorations')) {
            db.createObjectStore('explorations', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('inventory')) {
            db.createObjectStore('inventory', { keyPath: 'id' })
          }
        },
      })
    } catch {
      this._fallback = true
    }
  }

  // ---- Pet ----

  async setPet(pet: Pet): Promise<void> {
    if (this._fallback) {
      lsSet('pet:' + pet.id, pet)
      return
    }
    if (!this.db) return
    await this.db.put('pet', pet)
  }

  async getPet(id: string): Promise<Pet | undefined> {
    if (this._fallback) {
      return lsGet<Pet>('pet:' + id)
    }
    if (!this.db) return undefined
    return this.db.get('pet', id)
  }

  // ---- Tasks ----

  async setTasks(tasks: TaskState): Promise<void> {
    if (this._fallback) {
      lsSet('tasks', tasks)
      return
    }
    if (!this.db) return
    await this.db.put('tasks', { id: 'current', ...tasks })
  }

  async getTasks(): Promise<TaskState | undefined> {
    if (this._fallback) {
      return lsGet<TaskState>('tasks')
    }
    if (!this.db) return undefined
    const entry = await this.db.get('tasks', 'current')
    if (!entry) return undefined
    const { id: _id, ...rest } = entry as Record<string, unknown>
    return rest as unknown as TaskState
  }

  // ---- Cache ----

  async getFromCache<T>(key: string): Promise<T | undefined> {
    if (this._fallback) {
      const entry = lsGet<CacheEntry<T>>('cache:' + key)
      if (!entry) return undefined
      if (Date.now() - entry.timestamp > entry.ttl) {
        lsRemove('cache:' + key)
        return undefined
      }
      return entry.data
    }
    if (!this.db) return undefined
    const entry = await this.db.get('cache', key)
    if (!entry) return undefined
    const cached = entry as CacheEntry<T>
    if (Date.now() - cached.timestamp > cached.ttl) {
      await this.db.delete('cache', key)
      return undefined
    }
    return cached.data
  }

  async setCache<T>(key: string, data: T, ttl: number): Promise<void> {
    const entry: CacheEntry<T> = { key, data, timestamp: Date.now(), ttl }
    if (this._fallback) {
      lsSet('cache:' + key, entry)
      return
    }
    if (!this.db) return
    await this.db.put('cache', entry)
  }

  // ---- Explorations ----

  async setExplorations(logs: ExplorationLog[]): Promise<void> {
    if (this._fallback) {
      lsSet('explorations', logs)
      return
    }
    if (!this.db) return
    const tx = this.db.transaction('explorations', 'readwrite')
    await Promise.all([
      ...logs.map((log) => tx.store.put(log)),
      tx.done,
    ])
  }

  async getExplorations(): Promise<ExplorationLog[]> {
    if (this._fallback) {
      return lsGet<ExplorationLog[]>('explorations') ?? []
    }
    if (!this.db) return []
    return this.db.getAll('explorations')
  }

  // ---- Inventory ----

  async setInventory(inventory: Inventory): Promise<void> {
    if (this._fallback) {
      lsSet('inventory', inventory)
      return
    }
    if (!this.db) return
    await this.db.put('inventory', { id: 'current', ...inventory })
  }

  async getInventory(): Promise<Inventory | undefined> {
    if (this._fallback) {
      return lsGet<Inventory>('inventory')
    }
    if (!this.db) return undefined
    const entry = await this.db.get('inventory', 'current')
    if (!entry) return undefined
    const { id: _id, ...rest } = entry as Record<string, unknown>
    return rest as unknown as Inventory
  }
}

export const storageService = new StorageService()
