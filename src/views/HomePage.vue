<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { usePetStore } from '@/stores/petStore';
import { useGameStore } from '@/stores/gameStore';
import { useExploreStore } from '@/stores/exploreStore';
import { useGameLoop } from '@/composables/useGameLoop';
import PetCanvas from '@/components/pet/PetCanvas.vue';
import PetProfile from '@/components/pet/PetProfile.vue';
import InteractionBar from '@/components/interaction/InteractionBar.vue';
import DailyTaskList from '@/components/tasks/DailyTaskList.vue';
import ExploreLogModal from '@/components/logs/ExploreLogModal.vue';
import OfflineSummary from '@/components/game/OfflineSummary.vue';
import CreatePetModal from '@/components/game/CreatePetModal.vue';

const petStore = usePetStore();
const gameStore = useGameStore();
const exploreStore = useExploreStore();

// Start game loop
useGameLoop();

const showCreatePet = ref(false);
const showProfile = ref(false);
const showTasks = ref(false);
const showLogs = ref(false);
const drawerContent = ref<'tasks' | 'logs' | null>(null);

const petLoaded = ref(false);

onMounted(async () => {
  await petStore.loadLatestPet();
  petLoaded.value = true;
  if (!petStore.pet) {
    showCreatePet.value = true;
  }
});

function onPetCreated() {
  showCreatePet.value = false;
}

function openDrawer(type: 'tasks' | 'logs') {
  drawerContent.value = type;
}

function closeDrawer() {
  drawerContent.value = null;
}

const unviewedCount = computed(() => exploreStore.unviewedLogs.length);
</script>

<template>
  <div class="min-h-screen bg-bg text-body flex flex-col">
    <!-- Header -->
    <header class="flex items-center justify-between px-4 py-3 border-b border-border">
      <div class="flex items-center gap-2">
        <span class="text-lg font-bold text-heading tracking-tight">🐾 Oh My Pet</span>
      </div>
      <div v-if="petStore.pet" class="flex items-center gap-1">
        <button
          class="relative rounded-lg p-2 text-muted hover:text-heading hover:bg-surface-raised transition-colors"
          title="探索记录"
          @click="openDrawer('logs')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span
            v-if="unviewedCount > 0"
            class="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-danger text-white text-[9px] font-bold flex items-center justify-center"
          >
            {{ unviewedCount > 9 ? '9+' : unviewedCount }}
          </span>
        </button>
        <button
          class="rounded-lg p-2 text-muted hover:text-heading hover:bg-surface-raised transition-colors"
          title="每日任务"
          @click="openDrawer('tasks')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
          </svg>
        </button>
        <button
          class="rounded-lg p-2 text-muted hover:text-heading hover:bg-surface-raised transition-colors"
          title="宠物档案"
          @click="showProfile = true"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col items-center px-4 py-6 overflow-y-auto">
      <!-- Loading state -->
      <div v-if="!petLoaded" class="flex items-center justify-center flex-1">
        <div class="flex flex-col items-center gap-3 text-muted">
          <svg class="size-8 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 0 1 4 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span class="text-sm">加载中...</span>
        </div>
      </div>

      <!-- Pet area -->
      <template v-if="petLoaded && petStore.pet">
        <div class="w-full max-w-md flex flex-col items-center gap-4">
          <!-- Pet Canvas -->
          <PetCanvas />

          <!-- Interaction Bar -->
          <InteractionBar />
        </div>
      </template>
    </main>

    <!-- Bottom Drawer (Tasks / Logs) -->
    <Teleport to="body">
      <!-- Tasks Drawer -->
      <div
        v-if="drawerContent === 'tasks'"
        class="fixed inset-0 z-30 flex items-end sm:items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/60" @click="closeDrawer" />
        <div class="relative w-full max-w-md rounded-t-2xl sm:rounded-2xl bg-surface border border-border max-h-[70vh] overflow-hidden flex flex-col">
          <div class="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 class="text-lg font-bold text-heading">每日任务</h2>
            <button
              class="rounded-lg p-1.5 text-muted hover:text-heading hover:bg-surface-overlay transition-colors"
              @click="closeDrawer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="flex-1 overflow-y-auto p-4">
            <DailyTaskList />
          </div>
        </div>
      </div>

      <!-- Logs Drawer -->
      <ExploreLogModal v-if="drawerContent === 'logs'" @close="closeDrawer" />
    </Teleport>

    <!-- Modals -->
    <Teleport to="body">
      <CreatePetModal
        v-if="showCreatePet && petLoaded && !petStore.pet"
        @created="onPetCreated"
      />
      <OfflineSummary />
      <PetProfile v-if="showProfile" @close="showProfile = false" />
    </Teleport>
  </div>
</template>
