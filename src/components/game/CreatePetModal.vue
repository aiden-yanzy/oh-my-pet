<script setup lang="ts">
import { ref } from 'vue';
import { usePetStore } from '@/stores/petStore';
import BaseButton from '@/components/BaseButton.vue';
import BaseInput from '@/components/BaseInput.vue';

const petStore = usePetStore();

const emit = defineEmits<{
  created: []
}>();

const name = ref('');
const isCreating = ref(false);

const randomNames = [
  '小星星', '糯米团', '闪电', '棉花糖', '小太阳',
  '月亮', '草莓', '蓝莓', '小旋风', '泡泡',
  '咕噜', '小奇', '嘟嘟', '糖糖', '毛毛',
];

function randomName() {
  name.value = randomNames[Math.floor(Math.random() * randomNames.length)] ?? '小宠物';
}

async function handleCreate() {
  if (!name.value.trim() || isCreating.value) return;
  isCreating.value = true;
  try {
    await petStore.createPet(name.value.trim());
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
        <div class="text-5xl mb-3">🥚</div>
        <h2 class="text-xl font-bold text-heading">创建你的宠物</h2>
        <p class="text-sm text-muted mt-1">给它取一个名字吧！</p>
      </div>

      <div class="space-y-4">
        <div class="flex gap-2">
          <BaseInput
            v-model="name"
            placeholder="输入宠物名字"
            class="flex-1"
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
        <div class="flex justify-center py-4">
          <div class="w-24 h-24 rounded-full bg-surface-raised flex items-center justify-center">
            <svg viewBox="0 0 100 100" class="w-20 h-20">
              <!-- Simple pet preview -->
              <circle cx="50" cy="55" r="25" fill="#4ECDC4" stroke="#333" stroke-width="2.5" />
              <circle cx="38" cy="45" r="4" fill="#333" />
              <circle cx="62" cy="45" r="4" fill="#333" />
              <circle cx="50" cy="58" r="3" fill="#333" />
            </svg>
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
