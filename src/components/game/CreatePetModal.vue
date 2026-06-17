<script setup lang="ts">
import { ref } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { PET_STYLES, DEFAULT_STYLE_ID } from '@/data/petStyles';
import type { PetStyle } from '@/types/pet';
import BaseButton from '@/components/BaseButton.vue';

const petStore = usePetStore();

const emit = defineEmits<{
  created: []
}>();

const name = ref('');
const selectedStyleId = ref(DEFAULT_STYLE_ID);
const isCreating = ref(false);

const selectedStyle = ref<PetStyle>(PET_STYLES[0]!);

function selectStyle(id: string) {
  selectedStyleId.value = id;
  selectedStyle.value = PET_STYLES.find(s => s.id === id) ?? PET_STYLES[0]!;
}

function getPreviewColor(style: PetStyle): string {
  return style.accentColor;
}

const randomNames = [
  '小星星', '糯米团', '闪电', '棉花糖', '小太阳',
  '月亮', '草莓', '蓝莓', '小旋风', '泡泡',
  '咕噜', '小奇', '嘟嘟', '糖糖', '毛毛',
];

function randomName() {
  name.value = randomNames[Math.floor(Math.random() * randomNames.length)] ?? '小宠物';
}

// Initialize with default
selectStyle(DEFAULT_STYLE_ID);

async function handleCreate() {
  if (!name.value.trim() || isCreating.value) return;
  isCreating.value = true;
  try {
    await petStore.createPet(name.value.trim(), selectedStyleId.value);
    emit('created');
  } finally {
    isCreating.value = false;
  }
}
</script>

<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center">
    <!-- Backdrop -->
    <div class="absolute inset-0 bg-black/70" />

    <!-- Modal -->
    <div class="relative w-80 rounded-2xl bg-surface border border-border p-6 shadow-2xl">
      <div class="text-center mb-6">
        <div class="mb-3">
          <span class="text-5xl">{{ selectedStyle.emoji }}</span>
        </div>
        <h2 class="text-xl font-bold text-heading">创建你的宠物</h2>
        <p class="text-sm text-muted mt-1">选一个喜欢的样式，再给它取个名字！</p>
      </div>

      <!-- Pet style selection -->
      <div class="mb-4">
        <p class="text-xs text-muted mb-2 text-center">选择宠物类型</p>
        <div class="grid grid-cols-3 gap-2">
          <button
            v-for="style in PET_STYLES"
            :key="style.id"
            class="flex flex-col items-center gap-0.5 rounded-xl p-2 transition-all"
            :class="selectedStyleId === style.id
              ? 'bg-primary/15 ring-2 ring-primary/60'
              : 'bg-surface-raised hover:bg-surface-overlay'"
            @click="selectStyle(style.id)"
          >
            <span class="text-2xl">{{ style.emoji }}</span>
            <span class="text-[10px] font-medium text-body">{{ style.name }}</span>
          </button>
        </div>
      </div>

      <div class="space-y-4">
        <!-- Name input -->
        <div class="flex gap-2">
          <input
            v-model="name"
            placeholder="输入宠物名字"
            class="flex-1 px-3 py-2 rounded-xl bg-surface-raised border border-border text-body text-sm
                   placeholder:text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <BaseButton
            variant="secondary"
            size="sm"
            @click="randomName"
            title="随机名字"
            class="flex-shrink-0"
          >
            🎲
          </BaseButton>
        </div>

        <!-- Preview pet -->
        <div class="flex justify-center py-2">
          <div
            class="w-20 h-20 rounded-full flex items-center justify-center"
            :style="{ background: selectedStyle.accentColor + '20' }"
          >
            <span class="text-5xl">{{ selectedStyle.emoji }}</span>
          </div>
        </div>

        <BaseButton
          variant="primary"
          size="lg"
          class="w-full"
          :disabled="!name.trim()"
          :loading="isCreating"
          @click="handleCreate"
        >
          创建！
        </BaseButton>
      </div>
    </div>
  </div>
</template>
