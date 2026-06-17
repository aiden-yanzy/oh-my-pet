import type { Scene } from '@/types/event';

export const SCENES: Scene[] = [
  { id: 'grassland', name: '草原', unlockLevel: 0, theme: 'balanced' },
  { id: 'forest', name: '森林', unlockLevel: 10, theme: 'intelligence' },
  { id: 'mountain', name: '山地', unlockLevel: 15, theme: 'strength' },
];
