export type Personality = 'lively' | 'quiet' | 'foodie' | 'aloof' | 'curious';

export interface DNA {
  strengthGene: number;      // 0.8 - 1.2
  intelligenceGene: number;  // 0.8 - 1.2
  agilityGene: number;       // 0.8 - 1.2
  personality: Personality;
}

export interface PetBaseStats {
  happiness: number;      // 0-100
  health: number;         // 0-100
  experience: number;
  level: number;
}

export interface PetGrowthStats {
  strength: number;
  intelligence: number;
  agility: number;
  charm: number;
}

export type PetStats = PetBaseStats & PetGrowthStats;

/** Animation states for pet sprites */
export type PetAnimState = 'idle' | 'eating' | 'happy' | 'sleeping' | 'sick' | 'poop';

/** A single pixel: hex color string, or null for transparent */
export type Pixel = string | null;

/** 2D grid of pixels (row-major) for a sprite frame */
export type PixelGrid = Pixel[][];

/** Each sprite sheet maps animation states to pixel grids */
export interface PetSpriteSheet {
  width: number;
  height: number;
  frames: Partial<Record<PetAnimState, PixelGrid>>;
}

/** A pet style defines a species/look with its own sprite sheet */
export interface PetStyle {
  id: string;
  name: string;
  emoji: string;
  /** Colors used for border/stats accent */
  accentColor: string;
  sprites: PetSpriteSheet;
}

/** A wearable pixel accessory that layers over the pet sprite */
export interface PetAccessory {
  id: string;
  name: string;
  emoji: string;
  category: 'hat' | 'face' | 'neck';
  /** Offset from pet sprite top-left (in grid units, can be negative) */
  anchorX: number;
  anchorY: number;
  /** Pixel grid of the accessory */
  grid: PixelGrid;
}

export interface PetAppearance {
  formStage: number;
  dominantType: 'balanced' | 'strength' | 'intelligence' | 'agility';
  colorScheme: string;
  /** Current pet style id */
  styleId: string;
  /** Equipped accessory ids */
  accessories: string[];
}

export interface Pet {
  id: string;
  name: string;
  createdAt: number;
  lastActiveAt: number;
  dna: DNA;
  stats: PetStats;
  appearance: PetAppearance;
  skills: string[];
  userId?: string | null;
  syncedAt?: number | null;
}

// ──────────────────────────────────
// Vector pet definitions (new art style)
// ──────────────────────────────────

export type PetStyleId = 'cat' | 'dog' | 'bunny' | 'chick' | 'bear' | 'fox';

/** Color palette for a vector pet (hex numbers for PIXI) */
export interface PetPalette {
  body: number;
  bodyLight: number;
  ear: number;
  earInner: number;
  face: number;
  eye: number;
  eyeWhite: number;
  nose: number;
  mouth: number;
  blush: number;
  outline: number;
  belly: number;
}

export interface PetEyes {
  x1: number;
  x2: number;
  y: number;
  r: number;
  gap: number;
}

/** Vector-pet drawing definition */
export interface PetVectorDef {
  id: PetStyleId;
  name: string;
  emoji: string;
  accentColor: number;
  palette: PetPalette;
  body: { cx: number; cy: number; rx: number; ry: number };
  head: { cx: number; cy: number; r: number };
  ears: Array<{
    type: 'ellipse' | 'triangle';
    cx: number; cy: number;
    rx: number; ry: number;
    rot?: number;
    color?: keyof PetPalette;
    innerColor?: keyof PetPalette;
  }>;
  eyes: PetEyes;
  nose: { x: number; y: number; r: number };
  blush?: { x1: number; x2: number; y: number; rx: number; ry: number };
  whiskers?: Array<[number, number, number, number]>;
  tail?: { cx: number; cy: number; rx: number; ry: number };
}
