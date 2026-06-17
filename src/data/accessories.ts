import type { PetAccessory, PixelGrid } from '@/types/pet';

function parseSprite(def: string, palette: Record<string, string | null>): PixelGrid {
  const lines = def.trim().split('\n');
  return lines.map(line => [...line].map(ch => palette[ch] ?? null));
}

// ══════════════════════════════════════════
// 1. Red Bow (红蝴蝶结) — top of head
// ══════════════════════════════════════════
const bowPal = { R: '#FF2244', r: '#FF6688', D: '#CC1133' };
const bowGrid = parseSprite(`
..R...R..
.Dr...rD.
..RRRRR..
...R.R...
...R.R...
`, bowPal);

// ══════════════════════════════════════════
// 2. Crown (王冠) — top of head
// ══════════════════════════════════════════
const crownPal = { Y: '#FFD700', O: '#FFA500', D: '#8B6914', R: '#FF4444' };
const crownGrid = parseSprite(`
...Y.R.Y...
..YYY.YYY..
.YYYYYYYYYY.
YYYYYYYYYYYY
.YYYYYYYYYY.
`, crownPal);

// ══════════════════════════════════════════
// 3. Blue Cap (蓝色小帽) — forehead
// ══════════════════════════════════════════
const capPal = { B: '#4488FF', b: '#2255CC', w: '#FFFFFF', D: '#1133AA' };
const capGrid = parseSprite(`
..BBBBBBB..
.BBBBBBBBB.
BBBBBBBBBBB
BBBBbBwBBBB
.BBBbBwBBB.
..BBBBBBB..
`, capPal);

// ══════════════════════════════════════════
// 4. Black Glasses (黑框眼镜) — over eyes
// ══════════════════════════════════════════
const glassPal = { B: '#222222', w: '#FFFFFF', L: '#8833FF' };
const glassGrid = parseSprite(`
.BBB..BBB.
BwBw..BwBB
BwBwBBwBBw
.BBB..BBB.
.B....B..B.
`, glassPal);

// ══════════════════════════════════════════
// 5. Red Scarf (红围巾) — around neck
// ══════════════════════════════════════════
const scarfPal = { R: '#CC2244', r: '#DD4466', D: '#881133', Y: '#FFD700' };
const scarfGrid = parseSprite(`
...RRRRR...
..RRRRRRR..
.RRRRrRRRR.
RRRRrrrRRRR
RRRR...RRRR
.rR.....Rr.
..R.....R..
`, scarfPal);

// ══════════════════════════════════════════
// 6. Bow Tie (小领结) — under chin (neck area)
// ══════════════════════════════════════════
const bowtiePal = { B: '#333388', b: '#5555AA', D: '#222255', w: '#FFFFFF' };
const bowtieGrid = parseSprite(`
..BB..BB..
.BBB..BBB.
BBBBBBBBBB
.BBBBBBBB.
..BBBBBB..
...B..B...
`, bowtiePal);

// ══════════════════════════════════════════
// All accessories
// ══════════════════════════════════════════

export const PET_ACCESSORIES: PetAccessory[] = [
  {
    id: 'red-bow',
    name: '红蝴蝶结',
    emoji: '🎀',
    category: 'hat',
    anchorX: 2,   // centered on 20-wide pet (bow is 9 wide + 2 offset = center)
    anchorY: -2,  // sits just above head
    grid: bowGrid,
  },
  {
    id: 'crown',
    name: '金色皇冠',
    emoji: '👑',
    category: 'hat',
    anchorX: 3,   // centered on 20-wide pet (14 wide)
    anchorY: -3,  // above head
    grid: crownGrid,
  },
  {
    id: 'blue-cap',
    name: '蓝色小帽',
    emoji: '🧢',
    category: 'hat',
    anchorX: 3,   // centered
    anchorY: -1,  // slightly above head
    grid: capGrid,
  },
  {
    id: 'glasses',
    name: '黑框眼镜',
    emoji: '👓',
    category: 'face',
    anchorX: 2,   // centered
    anchorY: 5,   // align with eyes
    grid: glassGrid,
  },
  {
    id: 'scarf',
    name: '红围巾',
    emoji: '🧣',
    category: 'neck',
    anchorX: 2,   // centered
    anchorY: 9,   // align with neck
    grid: scarfGrid,
  },
  {
    id: 'bowtie',
    name: '小领结',
    emoji: '🎗️',
    category: 'neck',
    anchorX: 3,   // centered
    anchorY: 10,  // under chin
    grid: bowtieGrid,
  },
];

export function getAccessory(id: string): PetAccessory | undefined {
  return PET_ACCESSORIES.find(a => a.id === id);
}
