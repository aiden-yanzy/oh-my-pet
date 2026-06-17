<script setup lang="ts">
import { ref, computed } from 'vue';
import { PET_ACCESSORIES } from '@/data/accessories';
import { usePetStore } from '@/stores/petStore';

const emit = defineEmits<{ close: [] }>();
const petStore = usePetStore();

const categories = [
  { id: 'hat' as const, label: '🎩 头顶' },
  { id: 'face' as const, label: '👓 脸部' },
  { id: 'neck' as const, label: '🧣 脖子' },
];

function isEquipped(id: string): boolean {
  return petStore.pet?.appearance.accessories?.includes(id) ?? false;
}

function handleToggle(id: string) {
  petStore.toggleAccessory(id);
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-end sm:items-center justify-center">
    <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

    <div
      class="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface border border-border
             max-h-[75vh] overflow-hidden flex flex-col"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <div class="flex items-center gap-2">
          <h2 class="text-lg font-bold text-heading">🎨 衣橱</h2>
          <span class="text-xs text-muted bg-surface-raised px-2 py-0.5 rounded-full">
            装扮你的宠物
          </span>
        </div>
        <button
          class="rounded-lg p-1.5 text-muted hover:text-heading hover:bg-surface-overlay transition-colors"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-4 space-y-5">
        <!-- Current pet preview -->
        <div class="flex items-center gap-3 px-3 py-3 rounded-xl bg-surface-raised">
          <div class="text-3xl">{{ petStore.pet?.appearance.styleId === 'cat' ? '🐱'
            : petStore.pet?.appearance.styleId === 'dog' ? '🐶'
            : petStore.pet?.appearance.styleId === 'bunny' ? '🐰'
            : petStore.pet?.appearance.styleId === 'chick' ? '🐤'
            : petStore.pet?.appearance.styleId === 'bear' ? '🐻'
            : '🦊' }}</div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-heading truncate">{{ petStore.pet?.name }}</p>
            <p class="text-xs text-muted">
              已装备 {{ petStore.pet?.appearance.accessories?.length ?? 0 }} 件
            </p>
          </div>
          <button
            class="text-xs text-primary hover:text-primary/80 font-medium"
            @click="emit('close')"
          >
            完成 ✓
          </button>
        </div>

        <!-- Categories -->
        <div v-for="cat in categories" :key="cat.id" class="space-y-2">
          <h3 class="text-xs font-semibold text-muted uppercase tracking-wider">{{ cat.label }}</h3>
          <div class="space-y-1.5">
            <button
              v-for="acc in PET_ACCESSORIES.filter(a => a.category === cat.id)"
              :key="acc.id"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              :class="isEquipped(acc.id)
                ? 'bg-primary/10 ring-1 ring-primary/40'
                : 'bg-surface-raised hover:bg-surface-overlay'"
              @click="handleToggle(acc.id)"
            >
              <span class="text-xl shrink-0">{{ acc.emoji }}</span>
              <span class="flex-1 text-sm text-left font-medium text-body">{{ acc.name }}</span>
              <span
                class="text-xs font-medium"
                :class="isEquipped(acc.id) ? 'text-primary' : 'text-muted'"
              >
                {{ isEquipped(acc.id) ? '已装备 ✓' : '未装备' }}
              </span>
            </button>
          </div>

          <!-- Empty state -->
          <p
            v-if="PET_ACCESSORIES.filter(a => a.category === cat.id).length === 0"
            class="text-xs text-muted/60 text-center py-4"
          >
            暂无此分类的配饰
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
