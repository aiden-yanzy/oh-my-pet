import type { GameEvent } from '@/types/event';

export const PRESET_EVENTS: GameEvent[] = [
  // Grassland - Common
  { id: 'grassland_food_1', title: '发现浆果', description: '在草丛中发现了新鲜的浆果', sceneId: 'grassland', rarity: 'common', rewards: { items: ['apple'], experience: 10 } },
  { id: 'grassland_animal_1', title: '遇到小兔子', description: '遇到了一只可爱的小兔子，一起玩耍了一会儿', sceneId: 'grassland', rarity: 'common', rewards: { experience: 10, stats: { happiness: 10, charm: 1 } } },
  { id: 'grassland_exercise_1', title: '晨跑', description: '在清晨的草原上跑了一圈，感觉精力充沛', sceneId: 'grassland', rarity: 'common', rewards: { experience: 10, stats: { health: 5, agility: 2 } } },
  // Forest - Common
  { id: 'forest_mushroom_1', title: '采蘑菇', description: '在树下找到了几朵新鲜的蘑菇', sceneId: 'forest', rarity: 'common', rewards: { items: ['carrot'], experience: 15 } },
  { id: 'forest_herb_1', title: '发现药草', description: '发现了一片草药，对健康很有好处', sceneId: 'forest', rarity: 'common', rewards: { experience: 15, stats: { health: 8, intelligence: 2 } } },
  // Mountain - Common
  { id: 'mountain_climb_1', title: '攀岩', description: '成功攀爬上了一处陡峭的山壁', sceneId: 'mountain', rarity: 'common', rewards: { experience: 15, stats: { strength: 3, health: 5 } } },
  { id: 'mountain_ore_1', title: '发现矿石', description: '发现了一些闪闪发光的矿石', sceneId: 'mountain', rarity: 'common', rewards: { experience: 15, stats: { strength: 2 } } },
  // Rare events
  { id: 'treasure_chest', title: '🌟 发现宝箱', description: '找到了一个神秘的宝箱！', sceneId: 'grassland', rarity: 'rare', rewards: { experience: 50, items: ['special'] } },
  { id: 'forest_puzzle_1', title: '🧩 解谜', description: '发现了一个古老的谜题石碑，成功解开了！', sceneId: 'forest', rarity: 'rare', rewards: { experience: 25, stats: { intelligence: 5 } } },
  { id: 'mountain_summit', title: '⛰️ 登顶', description: '成功登上了山顶！壮丽的景色让你心旷神怡', sceneId: 'mountain', rarity: 'rare', rewards: { experience: 30, stats: { strength: 5, happiness: 10 } } },
];

export const EVENT_WEIGHTS = { common: 70, rare: 25, key: 5 };
