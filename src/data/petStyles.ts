import type { PetStyle, PixelGrid } from '@/types/pet';

/**
 * Parse a compact string sprite definition into a PixelGrid.
 * Each character maps to a color via palette, '.' = transparent.
 * Rows separated by newline.
 */
function parseSprite(def: string, palette: Record<string, string | null>): PixelGrid {
  const lines = def.trim().split('\n');
  return lines.map(line =>
    [...line].map(ch => palette[ch] ?? null)
  );
}

// Shared palette colors
const C = {
  w: '#FFFFFF',
  B: '#222222',
  L: '#555555',
  R: '#FF4444',
  W: '#FFE4B5',
  g: '#90EE90',
  t: '#87CEEB',
};

// ── Helper: define a palette with shared colors merged ──
// Each pet gets its own extended palette
const catPal = { ...C, o: '#FF8C00', O: '#FFA500', p: '#FFB6C1' };
const dogPal = { ...C, b: '#8B4513', p: '#D2B48C' };
const bunPal = { ...C, w: '#FFFFFF', p: '#FFB6C1', g: '#E8E8E8' };
const chickPal = { ...C, y: '#FFD700', Y: '#FFF44F', o: '#FF8C00', p: '#FF6B6B' };
const bearPal = { ...C, b: '#8B6914', B: '#A0762C', p: '#D2B48C' };
const foxPal = { ...C, o: '#FF6B00', O: '#FF8C42', w: '#FFFFFF', B: '#2D2D2D', p: '#FFB6C1' };

// ══════════════════════════════════════════
// 1. Cat - orange tabty
// ══════════════════════════════════════════
const catIdle = parseSprite(`
......oOoOoo.....
....oOOOOOOOOo...
...oOOOOOOOOOOo..
..oOOOBBOOBbOOOo.
..ooooBOOOBooo...
.oowwwwOOOOooooo.
..oooooOOOOooooo.
....ooooOOOOoo...
...oooooOOOOoo...
..oOOOOOOOOOOOo..
.oOOOOOOOOOOOOOo.
.oOOOOOOOOOOOOOO.
.ooOOOOOOOOOOOOo.
..oOOOOOOOOOOOO..
...ooOOOOOOOOoo..
....ooOOOOOOoo...
......OwwO......
`, catPal);

const catHappy = parseSprite(`
......oOoOoo.....
....oOOOOOOOOo...
...oOOOOOOOOOOo..
..oOOOwwOOwwOOOo.
..ooooBBOOBBooo..
.oowwwwOOOOooooo.
..oooooOOOOooooo.
....ooooOOOOoo...
...oooooOOOOoo...
..oOOOOOOOOOOOo..
.oOOOOOOOOOOOOOo.
.oOOOOOOOOOOOOOO.
.ooOOOOOOOOOOOOo.
..oOOOOOOOOOOOO..
...ooOOOOOOOOoo..
....ooOOOOOOoo...
......ORRO......
`, catPal);

const catSleep = parseSprite(`
......oOoOoo.....
....oOOOOOOOOo...
...oOOOOOOOOOOo..
..oOOO------OOOo.
..oooo------ooo..
.oowwwwOOOOooooo.
..oooooOOOOooooo.
....ooooOOOOoo...
...oooooOOOOoo...
..oOOOOOOOOOOOo..
.oOOOOOOOOOOOOOo.
.oOOOOOOOOOOOOOO.
.ooOOOOOOOOOOOOo.
..oOOOOOOOOOOOO..
...ooOOOOOOOOoo..
....ooOOOOOOoo...
......oo...o......
`, catPal);

// ══════════════════════════════════════════
// 2. Dog - brown puppy
// ══════════════════════════════════════════
const dogIdle = parseSprite(`
......bBBbB.......
....bBBBBBBb.....
...bBBBBBBBBb....
..bBBBBBbBbBBb...
..bbbBBBBBbbbb...
.bbpppBBBBpppbb..
..bbbbBBBBbbbb....
....bbBBBBBBb....
...bbBBBBBBBBb...
..bBBBBBBBBBBb...
.bBBBBBBBBBBBB...
.bBBBBBBBBBBBBB..
.bbBBBBBBBBBBBb..
..bBBBBBBBBBBBb..
...bbBBBBBBBBB...
....bbBBBBBBBbb..
......bwwb.......
`, dogPal);

const dogHappy = parseSprite(`
......bBBbB.......
....bBBBBBBb.....
...bBBBBBBBBb....
..bBBBBBwwBBBB...
..bbbBBwwBBbbbb..
.bbpppBBBBpppbb..
..bbbbBBBBbbbb....
....bbBBBBBBb....
...bbBBBBBBBBb...
..bBBBBBBBBBBb...
.bBBBBBBBBBBBB...
.bBBBBBBBBBBBBB..
.bbBBBBBBBBBBBb..
..bBBBBBBBBBBBb..
...bbBBBBBBBBB...
....bbBBBBBBBbb..
......bRwRb.......
`, dogPal);

const dogSleep = parseSprite(`
......bBBbB.......
....bBBBBBBb.....
...bBBBBBBBBb....
..bBBBBBBBBBBb...
..bbbBBBBBBbbbb..
.bbpppBBBBpppbb..
..bbbbBBBBbbbb....
....bbBBBBBBb....
...bbBBBBBBBBb...
..bBBBBBBBBBBb...
.bBBBBBBBBBBBB...
.bBBBBBBBBBBBBB..
.bbBBBBBBBBBBBb..
..bBBBBBBBBBBBb..
...bbBBBBBBBBB...
....bbBBBBBBBbb..
......b...b.......
`, dogPal);

// ══════════════════════════════════════════
// 3. Rabbit - white with pink ears
// ══════════════════════════════════════════
const bunnyIdle = parseSprite(`
....p.....p....
...ppp...ppp...
..wwwww.wwwww..
..wwwwwwwwwww..
..wwBBwwBBwww..
..wwwwwBwwwwww.
..wwwwwwwwwwww.
..Pwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
...wwwwwwwwww..
....wwwwwwww...
.....wwwwww....
......wwww.....
`, bunPal);

const bunnyHappy = parseSprite(`
....p.....p....
...ppp...ppp...
..wwwww.wwwww..
..wwwwwwwwwww..
..wwggwwggwww..
..wwwwwBwwwwww.
..wwwwwwwwwwww.
..Pwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
...wwwwwwwwww..
....wwwwwwww...
.....RwwwwR....
......wwww.....
`, bunPal);

const bunnySleep = parseSprite(`
....p.....p....
...ppp...ppp...
..wwwww.wwwww..
..wwwwwwwwwww..
..ww--ww--www..
..wwwwwBwwwwww.
..wwwwwwwwwwww.
..Pwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
..wwwwwwwwwwww.
...wwwwwwwwww..
....wwwwwwww...
.....wwwwww....
......wwww.....
`, bunPal);

// ══════════════════════════════════════════
// 4. Chick - yellow
// ══════════════════════════════════════════
const chickIdle = parseSprite(`
.......yy.......
......yyyy......
.....yyyyyy.....
....yyyyyyyy....
...yyBBBBByyyy..
...yyBBBBByyyy..
..yyyyoooo.yyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
...yyyyyyyyyy...
....yyyyyyyy....
.....yYYYYy.....
......yyyy......
`, chickPal);

const chickHappy = parseSprite(`
.......yy.......
......yyyy......
.....yyyyyy.....
....yyyyyyyy....
...yywwwwyyyy...
...yywwwwyyyy...
..yyyyoooo.yyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
...yyyyyyyyyy...
....yyyyyyyy....
.....YppppY.....
......yyyy......
`, chickPal);

const chickSleep = parseSprite(`
.......yy.......
......yyyy......
.....yyyyyy.....
....yyyyyyyy....
...yy------yy...
...yy------yy...
..yyyyoooo.yyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
..yyyyyyyyyyyyy.
...yyyyyyyyyy...
....yyyyyyyy....
.....yyyyyy.....
......yyyy......
`, chickPal);

// ══════════════════════════════════════════
// 5. Bear - brown bear cub
// ══════════════════════════════════════════
const bearIdle = parseSprite(`
......bB.Bb......
....bBB...BBb...
...bBBBBBBBBBB..
..bBBBBBbBBBbBB.
..bBBBBBBBBBBBB.
..bBBBBBbBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
...bBBBBBBBBBB..
....bBBBBBBBBB...
.....bppppppb....
......bBBBB.......
`, bearPal);

const bearHappy = parseSprite(`
......bB.Bb......
....bBB...BBb...
...bBBBBBBBBBB..
..bBBwBBBBBBwBBb.
..bBwwBBBBBBwwBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
...bBBBBBBBBBB..
....bBBBBBBBBB...
.....bRppppRb.....
......bBBBB.......
`, bearPal);

const bearSleep = parseSprite(`
......bB.Bb......
....bBB...BBb...
...bBBBBBBBBBB..
..bBBBBBBBBBBbBB.
..bBBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
..bBBBBBBBBBBBB.
...bBBBBBBBBBB..
....bBBBBBBBBB...
.....bppppppb.....
......b...b.......
`, bearPal);

// ══════════════════════════════════════════
// 6. Fox - orange-red fox
// ══════════════════════════════════════════
const foxIdle = parseSprite(`
....ooo...ooo....
...ooooo.ooooo...
..ooooooooooooo..
..ooBBBooBBBooo..
..ooooooooooooo..
..ooooooooooooo..
..oooooBBBoooo...
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
...ooooooooooo...
....ooooooooo....
.....owwwwo.....
`, foxPal);

const foxHappy = parseSprite(`
....ooo...ooo....
...ooooo.ooooo...
..ooooooooooooo..
..oogggoogggooo..
..ooooooooooooo..
..ooooooooooooo..
..oooooBBBoooo...
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
...ooooooooooo...
....ooooooooo....
.....oRwwRo.....
`, foxPal);

const foxSleep = parseSprite(`
....ooo...ooo....
...ooooo.ooooo...
..ooooooooooooo..
..oo---oo---ooo..
..ooooooooooooo..
..ooooooooooooo..
..oooooBBBoooo...
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
..ooooooooooooo..
...ooooooooooo...
....ooooooooo....
.....o....o.....
`, foxPal);

// ══════════════════════════════════════════
// Export
// ══════════════════════════════════════════
export const PET_STYLES: PetStyle[] = [
  {
    id: 'cat',
    name: '小猫咪',
    emoji: '🐱',
    accentColor: '#FF8C00',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: catIdle,
        happy: catHappy,
        eating: catHappy,
        sleeping: catSleep,
        sick: catSleep,
      },
    },
  },
  {
    id: 'dog',
    name: '小狗狗',
    emoji: '🐶',
    accentColor: '#8B4513',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: dogIdle,
        happy: dogHappy,
        eating: dogHappy,
        sleeping: dogSleep,
        sick: dogSleep,
      },
    },
  },
  {
    id: 'bunny',
    name: '小兔子',
    emoji: '🐰',
    accentColor: '#FFB6C1',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: bunnyIdle,
        happy: bunnyHappy,
        eating: bunnyHappy,
        sleeping: bunnySleep,
        sick: bunnySleep,
      },
    },
  },
  {
    id: 'chick',
    name: '小黄鸡',
    emoji: '🐤',
    accentColor: '#FFD700',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: chickIdle,
        happy: chickHappy,
        eating: chickHappy,
        sleeping: chickSleep,
        sick: chickSleep,
      },
    },
  },
  {
    id: 'bear',
    name: '小熊',
    emoji: '🐻',
    accentColor: '#8B6914',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: bearIdle,
        happy: bearHappy,
        eating: bearHappy,
        sleeping: bearSleep,
        sick: bearSleep,
      },
    },
  },
  {
    id: 'fox',
    name: '小狐狸',
    emoji: '🦊',
    accentColor: '#FF6B00',
    sprites: {
      width: 20,
      height: 17,
      frames: {
        idle: foxIdle,
        happy: foxHappy,
        eating: foxHappy,
        sleeping: foxSleep,
        sick: foxSleep,
      },
    },
  },
];

export function getPetStyle(id: string): PetStyle | undefined {
  return PET_STYLES.find(s => s.id === id);
}

export const DEFAULT_STYLE_ID = 'cat';
