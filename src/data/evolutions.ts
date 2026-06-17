import type { Evolution, Skill } from '@/types/evolution';

export const SKILLS: Skill[] = [
  { id: 'fast_recovery', name: '快速恢复', description: '离线恢复速度+50%', type: 'passive', effect: { recoveryBonus: 0.5 } },
  { id: 'strong_body', name: '强壮体魄', description: '力量型互动效果翻倍', type: 'interaction', effect: { strengthMultiplier: 2 } },
  { id: 'sharp_mind', name: '敏锐思维', description: '智力型互动效果翻倍', type: 'interaction', effect: { intelligenceMultiplier: 2 } },
  { id: 'agile_movement', name: '敏捷移动', description: '探索稀有事件概率+20%', type: 'exploration', effect: { rareEventBonus: 0.2 } },
  { id: 'treasure_hunter', name: '寻宝直觉', description: '探索时获得物品概率+30%', type: 'exploration', effect: { itemFindBonus: 0.3 } },
];

export const EVOLUTIONS: Evolution[] = [
  // Level-based evolutions
  { id: 'evo_level_10', fromStage: 0, toStage: 1, name: '初级进化', description: '宠物成长了！形态开始变化', dominantType: 'balanced',
    conditions: [{ type: 'level', params: { minLevel: 10 } }],
    unlockedSkills: ['fast_recovery'] },
  // Branch evolutions at level 20
  { id: 'evo_strength_20', fromStage: 1, toStage: 2, name: '力量形态', description: '力量主导的进化！体型增大', dominantType: 'strength',
    conditions: [{ type: 'level', params: { minLevel: 20 } }, { type: 'stat', params: { stat: 'strength', minValue: 100 } }],
    unlockedSkills: ['strong_body'] },
  { id: 'evo_intelligence_20', fromStage: 1, toStage: 2, name: '智慧形态', description: '智力主导的进化！头部变大', dominantType: 'intelligence',
    conditions: [{ type: 'level', params: { minLevel: 20 } }, { type: 'stat', params: { stat: 'intelligence', minValue: 100 } }],
    unlockedSkills: ['sharp_mind'] },
];
