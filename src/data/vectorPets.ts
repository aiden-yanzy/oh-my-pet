import type { PetVectorDef, PetStyleId } from '@/types/pet';

/**
 * Vector pet definitions — each pet is drawn with PIXI.Graphics primitives
 * (ellipses, circles, triangles, arcs) producing recognizable cute characters.
 *
 * Coordinate system: (0, 0) is drawing center. Canvas is 280×280.
 * Pet occupies roughly 160×160 centered.
 */

const PET_VECTORS: Record<PetStyleId, PetVectorDef> = {
  // ═══════════════════════════════════
  // Cat — orange tabby, round face, triangular ears, whiskers
  // ═══════════════════════════════════
  cat: {
    id: 'cat',
    name: '小猫咪',
    emoji: '🐱',
    accentColor: 0xFF8C00,
    palette: {
      body: 0xFFA500,
      bodyLight: 0xFFC04D,
      ear: 0xFFA500,
      earInner: 0xFFB6C1,
      face: 0xFFB84D,
      eye: 0x333333,
      eyeWhite: 0xFFFFFF,
      nose: 0xFF6B9D,
      mouth: 0x333333,
      blush: 0xFFB6C1,
      outline: 0xCC7700,
      belly: 0xFFD699,
    },
    body: { cx: 0, cy: 30, rx: 42, ry: 32 },
    head: { cx: 0, cy: -8, r: 34 },
    ears: [
      { type: 'triangle', cx: -24, cy: -38, rx: 11, ry: 15, color: 'ear' },
      { type: 'triangle', cx: 24, cy: -38, rx: 11, ry: 15, color: 'ear' },
      { type: 'ellipse', cx: -24, cy: -36, rx: 5, ry: 8, color: 'earInner' },
      { type: 'ellipse', cx: 24, cy: -36, rx: 5, ry: 8, color: 'earInner' },
    ],
    eyes: { x1: -11, x2: 11, y: -12, r: 5, gap: 22 },
    nose: { x: 0, y: -4, r: 2.5 },
    blush: { x1: -17, x2: 17, y: -5, rx: 6, ry: 4 },
    whiskers: [
      [-16, -3, -30, -8],
      [-16, -1, -32, -1],
      [-16, 1, -30, 6],
      [16, -3, 30, -8],
      [16, -1, 32, -1],
      [16, 1, 30, 6],
    ],
    tail: { cx: 42, cy: 20, rx: 8, ry: 22 },
  },

  // ═══════════════════════════════════
  // Dog — brown, floppy ears, round face
  // ═══════════════════════════════════
  dog: {
    id: 'dog',
    name: '小狗狗',
    emoji: '🐶',
    accentColor: 0x8B4513,
    palette: {
      body: 0xC68E5B,
      bodyLight: 0xD4A574,
      ear: 0x8B5E3C,
      earInner: 0xD2A679,
      face: 0xD4A574,
      eye: 0x222222,
      eyeWhite: 0xFFFFFF,
      nose: 0x333333,
      mouth: 0x333333,
      blush: 0xFFB6C1,
      outline: 0x6B3A1F,
      belly: 0xE8C9A0,
    },
    body: { cx: 0, cy: 32, rx: 44, ry: 34 },
    head: { cx: 0, cy: -6, r: 34 },
    ears: [
      { type: 'ellipse', cx: -26, cy: -16, rx: 9, ry: 18, rot: 0.2, color: 'ear' },
      { type: 'ellipse', cx: 26, cy: -16, rx: 9, ry: 18, rot: -0.2, color: 'ear' },
    ],
    eyes: { x1: -12, x2: 12, y: -10, r: 5, gap: 24 },
    nose: { x: 0, y: -2, r: 4 },
    blush: { x1: -18, x2: 18, y: -3, rx: 6, ry: 4 },
    tail: { cx: -42, cy: 24, rx: 7, ry: 16 },
  },

  // ═══════════════════════════════════
  // Bunny — white, long ears, pink
  // ═══════════════════════════════════
  bunny: {
    id: 'bunny',
    name: '小兔子',
    emoji: '🐰',
    accentColor: 0xFFB6C1,
    palette: {
      body: 0xFFFFFF,
      bodyLight: 0xF5F5F5,
      ear: 0xFFFFFF,
      earInner: 0xFFB6C1,
      face: 0xFFFFFF,
      eye: 0xCC4444,
      eyeWhite: 0xFFFFFF,
      nose: 0xFF9EB5,
      mouth: 0xCC4444,
      blush: 0xFFB6C1,
      outline: 0xCCCCCC,
      belly: 0xF0F0F0,
    },
    body: { cx: 0, cy: 32, rx: 38, ry: 30 },
    head: { cx: 0, cy: -2, r: 30 },
    ears: [
      { type: 'ellipse', cx: -14, cy: -52, rx: 8, ry: 28, color: 'ear' },
      { type: 'ellipse', cx: 14, cy: -52, rx: 8, ry: 28, color: 'ear' },
      { type: 'ellipse', cx: -14, cy: -46, rx: 5, ry: 18, color: 'earInner' },
      { type: 'ellipse', cx: 14, cy: -46, rx: 5, ry: 18, color: 'earInner' },
    ],
    eyes: { x1: -10, x2: 10, y: -6, r: 4, gap: 20 },
    nose: { x: 0, y: 2, r: 2 },
    blush: { x1: -16, x2: 16, y: 0, rx: 5, ry: 3.5 },
    whiskers: [
      [-14, 1, -26, -2],
      [-14, 2, -26, 4],
      [14, 1, 26, -2],
      [14, 2, 26, 4],
    ],
    tail: { cx: 36, cy: 30, rx: 8, ry: 7 },
  },

  // ═══════════════════════════════════
  // Chick — yellow, round, beak, tiny
  // ═══════════════════════════════════
  chick: {
    id: 'chick',
    name: '小黄鸡',
    emoji: '🐤',
    accentColor: 0xFFD700,
    palette: {
      body: 0xFFE44D,
      bodyLight: 0xFFF176,
      ear: 0xFFD54F,
      earInner: 0xFFF176,
      face: 0xFFE44D,
      eye: 0x333333,
      eyeWhite: 0xFFFFFF,
      nose: 0xFF8C00,
      mouth: 0xFF8C00,
      blush: 0xFFB6C1,
      outline: 0xDAA520,
      belly: 0xFFF176,
    },
    body: { cx: 0, cy: 8, rx: 40, ry: 36 },
    head: { cx: 0, cy: -18, r: 28 },
    ears: [
      // chick has no ears — cheek tufts
      { type: 'ellipse', cx: -28, cy: 4, rx: 7, ry: 5, color: 'body' },
      { type: 'ellipse', cx: 28, cy: 4, rx: 7, ry: 5, color: 'body' },
    ],
    eyes: { x1: -10, x2: 10, y: -22, r: 4, gap: 20 },
    nose: { x: 0, y: -14, r: 3 },
    blush: { x1: -16, x2: 16, y: -16, rx: 5, ry: 3 },
  },

  // ═══════════════════════════════════
  // Bear — brown, round everything, cuddly
  // ═══════════════════════════════════
  bear: {
    id: 'bear',
    name: '小熊',
    emoji: '🐻',
    accentColor: 0x8B6914,
    palette: {
      body: 0xA0762C,
      bodyLight: 0xB8914E,
      ear: 0xA0762C,
      earInner: 0xC9A96E,
      face: 0xB8914E,
      eye: 0x333333,
      eyeWhite: 0xFFFFFF,
      nose: 0x333333,
      mouth: 0x333333,
      blush: 0xFFB6C1,
      outline: 0x6B4E12,
      belly: 0xC9A96E,
    },
    body: { cx: 0, cy: 28, rx: 46, ry: 38 },
    head: { cx: 0, cy: -10, r: 34 },
    ears: [
      { type: 'ellipse', cx: -24, cy: -42, rx: 11, ry: 11, color: 'ear' },
      { type: 'ellipse', cx: 24, cy: -42, rx: 11, ry: 11, color: 'ear' },
      { type: 'ellipse', cx: -24, cy: -42, rx: 6, ry: 6, color: 'earInner' },
      { type: 'ellipse', cx: 24, cy: -42, rx: 6, ry: 6, color: 'earInner' },
    ],
    eyes: { x1: -12, x2: 12, y: -14, r: 5, gap: 24 },
    nose: { x: 0, y: -4, r: 3.5 },
    blush: { x1: -18, x2: 18, y: -6, rx: 6, ry: 4 },
  },

  // ═══════════════════════════════════
  // Fox — orange-red, pointed face, big triangular ears, bushy tail
  // ═══════════════════════════════════
  fox: {
    id: 'fox',
    name: '小狐狸',
    emoji: '🦊',
    accentColor: 0xFF6B00,
    palette: {
      body: 0xFF6B00,
      bodyLight: 0xFF8C42,
      ear: 0xFF6B00,
      earInner: 0xFFB6C1,
      face: 0xFFB84D,
      eye: 0x333333,
      eyeWhite: 0xFFFFFF,
      nose: 0x222222,
      mouth: 0x333333,
      blush: 0xFFB6C1,
      outline: 0xCC5500,
      belly: 0xFFD699,
    },
    body: { cx: 0, cy: 30, rx: 40, ry: 32 },
    head: { cx: 0, cy: -6, r: 30 },
    ears: [
      { type: 'triangle', cx: -22, cy: -40, rx: 12, ry: 18, color: 'ear' },
      { type: 'triangle', cx: 22, cy: -40, rx: 12, ry: 18, color: 'ear' },
      { type: 'ellipse', cx: -22, cy: -38, rx: 5, ry: 10, color: 'earInner' },
      { type: 'ellipse', cx: 22, cy: -38, rx: 5, ry: 10, color: 'earInner' },
    ],
    eyes: { x1: -10, x2: 10, y: -10, r: 4.5, gap: 20 },
    nose: { x: 0, y: -1, r: 2.5 },
    blush: { x1: -16, x2: 16, y: -4, rx: 5, ry: 3.5 },
    tail: { cx: 40, cy: 24, rx: 10, ry: 24 },
  },
};

export function getPetVector(id: string): PetVectorDef | undefined {
  return PET_VECTORS[id as PetStyleId];
}

export function getAllPetVectors(): PetVectorDef[] {
  return Object.values(PET_VECTORS);
}

export default PET_VECTORS;
