<script setup lang="ts">
import { ref, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { EVOLUTIONS, SKILLS } from '@/data/evolutions';
import BaseButton from '@/components/BaseButton.vue';
import BaseBadge from '@/components/BaseBadge.vue';

const petStore = usePetStore();

const emit = defineEmits<{
  close: []
}>();

const activeTab = ref<'stats' | 'skills' | 'evolution'>('stats');

const statLabels: Record<string, string> = {
  strength: '力量', intelligence: '智力', agility: '敏捷', charm: '魅力',
};

const statIcons: Record<string, string> = {
  strength: '💪', intelligence: '🧠', agility: '🏃', charm: '✨',
};

function statBarValue(statName: string): number {
  if (!petStore.pet) return 0;
  const val = (petStore.pet.stats as Record<string, number>)[statName] ?? 0;
  return Math.min(val, 200) / 2;
}

const unlockedSkillIds = computed(() => petStore.pet?.skills ?? []);

const unlockedSkills = computed(() =>
  SKILLS.filter(s => unlockedSkillIds.value.includes(s.id))
);

const availableSkills = computed(() =>
  SKILLS.filter(s => !unlockedSkillIds.value.includes(s.id))
);

function getEvolutionStage(stage: number) {
  const evos = EVOLUTIONS.filter(e => e.toStage === stage);
  if (evos.length === 0) return null;
  return evos[0]!;
}
</script>

<template>
  <div class="fixed inset-0 z-30 flex items-end sm:items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/60" @click="emit('close')" />

    <!-- Panel -->
    <div class="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface border border-border max-h-[80vh] overflow-hidden flex flex-col">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 class="text-lg font-bold text-heading">
          {{ petStore.pet?.name ?? '宠物档案' }}
        </h2>
        <button
          class="rounded-lg p-1.5 text-muted hover:text-heading hover:bg-surface-overlay transition-colors"
          @click="emit('close')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b border-border">
        <button
          v-for="tab in ([
            { id: 'stats' as const, label: '属性' },
            { id: 'skills' as const, label: '技能' },
            { id: 'evolution' as const, label: '进化' },
          ])"
          :key="tab.id"
          class="flex-1 py-3 text-sm font-medium transition-colors"
          :class="activeTab === tab.id
            ? 'text-primary border-b-2 border-primary'
            : 'text-muted hover:text-heading'"
          @click="activeTab = tab.id"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-5">
        <!-- Stats Tab -->
        <div v-if="activeTab === 'stats' && petStore.pet" class="space-y-4">
          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-heading">基础属性</h3>
            <div class="space-y-2">
              <div class="flex items-center gap-3">
                <span>😊 快乐</span>
                <div class="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div class="h-full rounded-full bg-success" :style="{ width: `${petStore.pet.stats.happiness}%` }" />
                </div>
                <span class="text-xs text-muted w-8 text-right">{{ Math.round(petStore.pet.stats.happiness) }}</span>
              </div>
              <div class="flex items-center gap-3">
                <span>❤️ 健康</span>
                <div class="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div class="h-full rounded-full bg-danger" :style="{ width: `${petStore.pet.stats.health}%` }" />
                </div>
                <span class="text-xs text-muted w-8 text-right">{{ Math.round(petStore.pet.stats.health) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <h3 class="text-sm font-semibold text-heading">成长属性</h3>
            <div class="space-y-2">
              <div v-for="(label, key) in statLabels" :key="key" class="flex items-center gap-3">
                <span>{{ statIcons[key] ?? '📊' }} {{ label }}</span>
                <div class="flex-1 h-2 rounded-full bg-surface-raised overflow-hidden">
                  <div class="h-full rounded-full bg-primary" :style="{ width: `${statBarValue(key)}%` }" />
                </div>
                <span class="text-xs text-muted w-10 text-right">
                  {{ (petStore.pet.stats as Record<string, number>)[key] ?? 0 }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Skills Tab -->
        <div v-if="activeTab === 'skills'" class="space-y-4">
          <div v-if="unlockedSkills.length > 0" class="space-y-2">
            <h3 class="text-sm font-semibold text-heading">已解锁技能</h3>
            <div
              v-for="skill in unlockedSkills"
              :key="skill.id"
              class="rounded-lg border border-border bg-surface-raised p-3"
            >
              <div class="flex items-center gap-2 mb-1">
                <BaseBadge variant="success">✓</BaseBadge>
                <span class="text-sm font-medium text-heading">{{ skill.name }}</span>
              </div>
              <p class="text-xs text-body">{{ skill.description }}</p>
            </div>
          </div>

          <div v-if="availableSkills.length > 0" class="space-y-2">
            <h3 class="text-sm font-semibold text-heading">可习得技能</h3>
            <div
              v-for="skill in availableSkills"
              :key="skill.id"
              class="rounded-lg border border-border p-3 opacity-60"
            >
              <div class="flex items-center gap-2 mb-1">
                <BaseBadge>🔒</BaseBadge>
                <span class="text-sm font-medium text-muted">{{ skill.name }}</span>
              </div>
              <p class="text-xs text-muted">{{ skill.description }}</p>
            </div>
          </div>

          <div v-if="unlockedSkills.length === 0 && availableSkills.length === 0" class="text-center text-muted py-8">
            <span class="text-3xl">📖</span>
            <p class="mt-2 text-sm">暂无技能信息</p>
          </div>
        </div>

        <!-- Evolution Tab -->
        <div v-if="activeTab === 'evolution'" class="space-y-4">
          <div class="space-y-3">
            <div
              v-for="stage in [0, 1, 2]"
              :key="stage"
              class="flex items-center gap-3 rounded-lg border p-3"
              :class="(petStore.pet?.appearance.formStage ?? 0) >= stage
                ? 'border-primary bg-primary-dim'
                : 'border-border opacity-50'"
            >
              <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                :class="(petStore.pet?.appearance.formStage ?? 0) >= stage ? 'bg-primary/20' : 'bg-surface-raised'"
              >
                <span class="text-xl">{{ stage === 0 ? '🥚' : stage === 1 ? '🐣' : '🦋' }}</span>
              </div>
              <div class="flex-1">
                <div class="text-sm font-medium" :class="(petStore.pet?.appearance.formStage ?? 0) >= stage ? 'text-primary' : 'text-muted'">
                  {{ stage === 0 ? '初始形态' : stage === 1 ? '初级进化' : '高级进化' }}
                </div>
                <div class="text-xs text-muted">
                  {{ stage === 0 ? 'Lv.1 起始' : stage === 1 ? 'Lv.10 解锁' : 'Lv.20 解锁' }}
                </div>
              </div>
              <div v-if="(petStore.pet?.appearance.formStage ?? 0) >= stage" class="text-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                </svg>
              </div>
              <div v-else class="text-muted">🔒</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
