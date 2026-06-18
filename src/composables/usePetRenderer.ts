import type { Pet, PetAnimState } from '@/types/pet';
import type { PetVectorDef } from '@/types/pet';
import { getPetVector } from '@/data/vectorPets';
import { getAccessory } from '@/data/accessories';

import { ref, watch, type Ref } from 'vue';
import { Application, Graphics, Container, Text } from 'pixi.js';

// ─────────────────────────────────────────────────
// Vector pet rendering helpers (PIXI.Graphics)
// PIXI v8 API: g.circle(x,y,r).fill(c) / g.ellipse(x,y,rx,ry).fill(c)
//              g.moveTo+lineTo+closePath.fill(c) for polygons
// ─────────────────────────────────────────────────

function drawEllipse(
  g: Graphics,
  cx: number, cy: number,
  rx: number, ry: number,
  fill: number,
  stroke?: { color: number; width: number },
) {
  g.ellipse(cx, cy, rx, ry);
  g.fill(fill);
  if (stroke) {
    g.rect(cx - rx, cy - ry, rx * 2, ry * 2);
    g.stroke({ color: stroke.color, width: stroke.width });
  }
}

function drawCircle(
  g: Graphics,
  cx: number, cy: number,
  r: number,
  fill: number,
  stroke?: { color: number; width: number },
) {
  g.circle(cx, cy, r);
  g.fill(fill);
  if (stroke) {
    g.stroke({ color: stroke.color, width: stroke.width });
  }
}

function drawTriangle(
  g: Graphics,
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  fill: number,
) {
  g.moveTo(x1, y1);
  g.lineTo(x2, y2);
  g.lineTo(x3, y3);
  g.closePath();
  g.fill(fill);
}

/** Draw idle eyes — two small dark circles */
function drawIdleEyes(g: Graphics, def: PetVectorDef) {
  const e = def.eyes;
  drawCircle(g, e.x1, e.y, e.r, def.palette.eye);
  drawCircle(g, e.x2, e.y, e.r, def.palette.eye);
}

/** Draw happy eyes — ^_^ shaped arcs */
function drawHappyEyes(g: Graphics, def: PetVectorDef) {
  const e = def.eyes;
  const arcR = e.r * 1.2;
  // Left eye arc
  g.arc(e.x1, e.y, arcR, -Math.PI, 0);
  g.stroke({ color: def.palette.eye, width: 2.5 });
  // Right eye arc
  g.arc(e.x2, e.y, arcR, -Math.PI, 0);
  g.stroke({ color: def.palette.eye, width: 2.5 });
}

/** Draw closed eyes (sleeping) — horizontal lines */
function drawSleepingEyes(g: Graphics, def: PetVectorDef) {
  const e = def.eyes;
  const lineW = e.r * 1.4;
  // Left
  g.moveTo(e.x1 - lineW, e.y);
  g.lineTo(e.x1 + lineW, e.y);
  g.stroke({ color: def.palette.eye, width: 2.5 });
  // Right
  g.moveTo(e.x2 - lineW, e.y);
  g.lineTo(e.x2 + lineW, e.y);
  g.stroke({ color: def.palette.eye, width: 2.5 });
}

/** Draw sick eyes — smaller, slightly hooded */
function drawSickEyes(g: Graphics, def: PetVectorDef) {
  const e = def.eyes;
  const smallR = e.r * 0.6;
  drawCircle(g, e.x1, e.y, smallR, def.palette.eye);
  drawCircle(g, e.x2, e.y, smallR, def.palette.eye);
  // Hooded top line
  g.moveTo(e.x1 - e.r, e.y - e.r * 0.5);
  g.lineTo(e.x1 + e.r, e.y - e.r * 0.5);
  g.stroke({ color: def.palette.outline, width: 2 });
  g.moveTo(e.x2 - e.r, e.y - e.r * 0.5);
  g.lineTo(e.x2 + e.r, e.y - e.r * 0.5);
  g.stroke({ color: def.palette.outline, width: 2 });
}

/** Draw mouth based on state */
function drawMouth(g: Graphics, def: PetVectorDef, state: PetAnimState, sick: boolean) {
  if (sick) {
    // Grimace line
    g.moveTo(def.nose.x - 3, def.nose.y + 3);
    g.lineTo(def.nose.x + 3, def.nose.y + 3);
    g.stroke({ color: def.palette.mouth, width: 1.5 });
  } else if (state === 'happy' || state === 'eating') {
    // Smile arc
    g.arc(def.nose.x, def.nose.y + 1, 4, 0.1, Math.PI - 0.1);
    g.stroke({ color: def.palette.mouth, width: 1.5 });
  } else if (state === 'sleeping') {
    // Small neutral mouth
    g.circle(def.nose.x, def.nose.y + 2, 1.5);
    g.fill(def.palette.mouth);
  } else {
    // Small dot mouth
    g.circle(def.nose.x, def.nose.y + 2, 1.5);
    g.fill(def.palette.mouth);
  }
}

/** Draw blush marks */
function drawBlush(g: Graphics, def: PetVectorDef) {
  if (!def.blush) return;
  const b = def.blush;
  drawEllipse(g, b.x1, b.y, b.rx, b.ry, def.palette.blush);
  drawEllipse(g, b.x2, b.y, b.rx, b.ry, def.palette.blush);
}

/** Draw whiskers (cat, bunny, fOX) */
function drawWhiskers(g: Graphics, def: PetVectorDef) {
  if (!def.whiskers) return;
  for (const [x1, y1, x2, y2] of def.whiskers) {
    g.moveTo(x1, y1);
    g.lineTo(x2, y2);
    g.stroke({ color: def.palette.outline, width: 1 });
  }
}

/** Draw tail */
function drawTail(g: Graphics, def: PetVectorDef) {
  if (!def.tail) return;
  drawEllipse(g, def.tail.cx, def.tail.cy, def.tail.rx, def.tail.ry, def.palette.body);
}

/** Apply grayish tint to a color for sick state */
function sickColor(c: number): number {
  const r = Math.round(((c >> 16) & 0xFF) * 0.5 + 128 * 0.5);
  const g = Math.round(((c >> 8) & 0xFF) * 0.5 + 128 * 0.5);
  const b = Math.round((c & 0xFF) * 0.5 + 128 * 0.5);
  return (r << 16) | (g << 8) | b;
}

// ─────────────────────────────────────────────────
// Pet canvas composable
// ─────────────────────────────────────────────────

export function usePetRenderer(
  canvasRef: Ref<HTMLDivElement | null>,
  pet: Ref<Pet | null>,
  moodAnim: Ref<PetAnimState>,
  poopCount: Ref<number>,
  isSleeping: Ref<boolean>,
  isSick: Ref<boolean>,
) {
  const app = ref<Application | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mainContainer = ref<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const effectContainer = ref<any>(null);
  let animFrame = 0;
  let frameCount = 0;
  let clickBounce = 0;

  async function init(): Promise<void> {
    if (!canvasRef.value) return;
    const pixiApp = new Application();
    await pixiApp.init({
      width: 280,
      height: 280,
      backgroundAlpha: 0,
      antialias: true,
      resolution: 2,
    });
    const canvas = pixiApp.canvas as HTMLCanvasElement;
    canvas.style.cursor = 'pointer';
    canvas.addEventListener('click', onCanvasClick);
    canvasRef.value.appendChild(canvas);
    app.value = pixiApp;
    drawPet();
    startAnimation();
  }

  function onCanvasClick() {
    if (!pet.value || isSick.value) return;
    clickBounce = 15;
    const g = new Graphics();
    const emojis = ['😊', '❤️', '⭐', '✨'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const t = new Text({
      text: emoji,
      style: { fontSize: 24, fill: 0xFFFFFF },
    });
    t.anchor.set(0.5);
    t.x = 140 + (Math.random() - 0.5) * 60;
    t.y = 80 + Math.random() * 40;
    effectContainer.value?.addChild(t);
    setTimeout(() => {
      effectContainer.value?.removeChild(t);
      t.destroy();
    }, 800);
  }

  /** Draw pixel-grid accessories overlaid on the vector pet */
  function drawAccessories(
    g: Graphics,
    equippedIds: string[],
    def: PetVectorDef,
    ox: number,
    oy: number,
    scale: number,
  ) {
    if (!equippedIds.length) return;
    for (const accId of equippedIds) {
      const acc = getAccessory(accId);
      if (!acc) continue;
      const grid = acc.grid;
      const pixelSize = 5;
      // Center accessories around pet's head
      const headX = ox + def.head.cx * scale;
      const headY = oy + def.head.cy * scale;
      const gridW = (grid[0]?.length ?? 0) * pixelSize;
      const gridH = grid.length * pixelSize;
      const accCenterX = headX - gridW / 2;
      const accCenterY = headY - gridH / 2 - 10;
      for (let y = 0; y < grid.length; y++) {
        const row = grid[y];
        if (!row) continue;
        for (let x = 0; x < row.length; x++) {
          const color = row[x];
          if (color) {
            const px = accCenterX + x * pixelSize;
            const py = accCenterY + y * pixelSize;
            g.rect(px, py, pixelSize, pixelSize);
            g.fill(parseInt(color.replace('#', ''), 16));
          }
        }
      }
    }
  }

  function drawPet(): void {
    if (!app.value || !pet.value) return;
    const stage = app.value.stage;

    // Clear previous
    if (mainContainer.value) {
      stage.removeChild(mainContainer.value);
      mainContainer.value.destroy({ children: true });
    }
    if (effectContainer.value) {
      stage.removeChild(effectContainer.value);
      effectContainer.value.destroy({ children: true });
    }

    const container = new Container();
    const effects = new Container();
    const g = new Graphics();

    const p = pet.value;
    const state = moodAnim.value;
    const sleeping = isSleeping.value;
    const sick = isSick.value;
    const poops = poopCount.value;

    // ── Get vector definition ──
    const def = getPetVector(p.appearance.styleId);
    if (!def) return;

    // Canvas center + scale
    // All pet coords are relative to (0,0), multiply by scale and add OX/OY
    const SCALE = 1.25;
    const OX = 140;
    const OY = 140 + 5; // slight center offset

    // Helper: translate pet-relative coords to canvas coords
    const tx = (x: number, y: number) => ({ x: OX + x * SCALE, y: OY + y * SCALE });

    // ── Shadow under pet ──
    const shadowC = tx(0, def.body.cy + def.body.ry + 5);
    drawEllipse(g, shadowC.x, shadowC.y, def.body.rx * SCALE * 0.7, 6, 0x000000);

    // Tail
    if (def.tail) {
      const tc = tx(def.tail.cx, def.tail.cy);
      drawEllipse(g, tc.x, tc.y, def.tail.rx * SCALE, def.tail.ry * SCALE, sick ? sickColor(def.palette.body) : def.palette.body);
    }

    // Body
    const bodyC = tx(def.body.cx, def.body.cy);
    drawEllipse(g, bodyC.x, bodyC.y, def.body.rx * SCALE, def.body.ry * SCALE,
      sick ? sickColor(def.palette.body) : def.palette.body);

    // Belly highlight
    if (def.body.rx > 20 && def.body.ry > 20) {
      drawEllipse(g, bodyC.x, bodyC.y + 4 * SCALE,
        def.body.rx * 0.55 * SCALE, def.body.ry * 0.5 * SCALE,
        sick ? sickColor(def.palette.bodyLight) : def.palette.bodyLight);
    }

    // Ears
    for (const ear of def.ears) {
      const ec = tx(ear.cx, ear.cy);
      const earColor = sick
        ? sickColor(def.palette[ear.color ?? 'ear'])
        : def.palette[ear.color ?? 'ear'];
      if (ear.type === 'triangle') {
        drawTriangle(
          g,
          ec.x - ear.rx * SCALE, ec.y - ear.ry * SCALE,
          ec.x + ear.rx * SCALE, ec.y - ear.ry * SCALE,
          ec.x, ec.y + ear.ry * SCALE,
          earColor,
        );
      } else {
        drawEllipse(g, ec.x, ec.y, ear.rx * SCALE, ear.ry * SCALE, earColor);
        // Inner ear
        if (ear.innerColor) {
          const innerColor = sick
            ? sickColor(def.palette[ear.innerColor])
            : def.palette[ear.innerColor];
          drawEllipse(g, ec.x, ec.y + 2 * SCALE,
            Math.max(ear.rx * 0.5, 3) * SCALE,
            Math.max(ear.ry * 0.5, 3) * SCALE,
            innerColor);
        }
      }
    }

    // Head
    const headC = tx(def.head.cx, def.head.cy);
    drawCircle(g, headC.x, headC.y, def.head.r * SCALE,
      sick ? sickColor(def.palette.face) : def.palette.face);

    // ── Eyes (state-dependent) ──
    const eyeC1 = tx(def.eyes.x1, def.eyes.y);
    const eyeC2 = tx(def.eyes.x2, def.eyes.y);
    const eyeR = def.eyes.r * SCALE;
    const sickPal = def.palette.eye; // eye color stays the same even when sick

    if (sick) {
      // Small sick eyes
      drawCircle(g, eyeC1.x, eyeC1.y, eyeR * 0.6, sickPal);
      drawCircle(g, eyeC2.x, eyeC2.y, eyeR * 0.6, sickPal);
      g.moveTo(eyeC1.x - eyeR, eyeC1.y - eyeR * 0.5);
      g.lineTo(eyeC1.x + eyeR, eyeC1.y - eyeR * 0.5);
      g.stroke({ color: def.palette.outline, width: 2 });
      g.moveTo(eyeC2.x - eyeR, eyeC2.y - eyeR * 0.5);
      g.lineTo(eyeC2.x + eyeR, eyeC2.y - eyeR * 0.5);
      g.stroke({ color: def.palette.outline, width: 2 });
    } else if (state === 'sleeping') {
      // Horizontal lines
      const lineW = eyeR * 1.4;
      g.moveTo(eyeC1.x - lineW, eyeC1.y);
      g.lineTo(eyeC1.x + lineW, eyeC1.y);
      g.stroke({ color: sickPal, width: 2.5 });
      g.moveTo(eyeC2.x - lineW, eyeC2.y);
      g.lineTo(eyeC2.x + lineW, eyeC2.y);
      g.stroke({ color: sickPal, width: 2.5 });
    } else if (state === 'happy' || state === 'eating') {
      // ^_^ arcs
      g.arc(eyeC1.x, eyeC1.y, eyeR * 1.2, -Math.PI, 0);
      g.stroke({ color: sickPal, width: 2.5 });
      g.arc(eyeC2.x, eyeC2.y, eyeR * 1.2, -Math.PI, 0);
      g.stroke({ color: sickPal, width: 2.5 });
    } else {
      // Normal circles
      drawCircle(g, eyeC1.x, eyeC1.y, eyeR, sickPal);
      drawCircle(g, eyeC2.x, eyeC2.y, eyeR, sickPal);
    }

    // Nose
    const noseC = tx(def.nose.x, def.nose.y);
    drawCircle(g, noseC.x, noseC.y, def.nose.r * SCALE,
      sick ? sickColor(def.palette.nose) : def.palette.nose);

    // Mouth (state-dependent)
    const mouthX = noseC.x;
    const mouthY = noseC.y + 2 * SCALE;
    if (sick) {
      g.moveTo(mouthX - 3 * SCALE, mouthY);
      g.lineTo(mouthX + 3 * SCALE, mouthY);
      g.stroke({ color: def.palette.mouth, width: 1.5 });
    } else if (state === 'happy' || state === 'eating') {
      g.arc(mouthX, mouthY, 4 * SCALE, 0.1, Math.PI - 0.1);
      g.stroke({ color: def.palette.mouth, width: 1.5 });
    } else if (state === 'sleeping') {
      drawCircle(g, mouthX, mouthY, 1.5 * SCALE, def.palette.mouth);
    } else {
      drawCircle(g, mouthX, mouthY, 1.5 * SCALE, def.palette.mouth);
    }

    // Blush (happy/eating only)
    if ((state === 'happy' || state === 'eating') && def.blush) {
      const b = def.blush;
      const bl1 = tx(b.x1, b.y);
      const bl2 = tx(b.x2, b.y);
      drawEllipse(g, bl1.x, bl1.y, b.rx * SCALE, b.ry * SCALE, def.palette.blush);
      drawEllipse(g, bl2.x, bl2.y, b.rx * SCALE, b.ry * SCALE, def.palette.blush);
    }

    // Whiskers
    if (def.whiskers) {
      for (const [x1, y1, x2, y2] of def.whiskers) {
        const p1 = tx(x1, y1);
        const p2 = tx(x2, y2);
        g.moveTo(p1.x, p1.y);
        g.lineTo(p2.x, p2.y);
        g.stroke({ color: def.palette.outline, width: 1 });
      }
    }

    // ── Draw accessories ──
    drawAccessories(g, p.appearance.accessories ?? [], def, OX, OY, SCALE);

    container.addChild(g);

    // ── Eating: food particle near head ──
    if (state === 'eating') {
      const foodG = new Graphics();
      foodG.circle(OX + 35, OY - 20, 7);
      foodG.fill(0xFF8C00);
      foodG.circle(OX + 35, OY - 20, 7);
      foodG.stroke({ color: 0xCC6600, width: 1.5 });
      container.addChild(foodG);
    }

    // ── Sleeping Zzz ──
    if (sleeping) {
      ['z', 'z', 'z'].forEach((letter, i) => {
        const zText = new Text({
          text: letter,
          style: { fontSize: 16 - i * 3, fill: 0x89CFF0 },
        });
        zText.anchor.set(0.5);
        zText.x = OX + (def.head.cx + def.head.r + 12 + i * 10) * SCALE;
        zText.y = OY + (def.head.cy - def.head.r - 8 - i * 12) * SCALE;
        effects.addChild(zText);
      });
    }

    // ── Sick effects ──
    if (sick) {
      const sweatG = new Graphics();
      const swX = OX + (def.head.cx - def.head.r - 8) * SCALE;
      const swY = OY + (def.head.cy - def.head.r * 0.5) * SCALE;
      // Sweat drop triangle
      sweatG.moveTo(swX - 4, swY);
      sweatG.lineTo(swX, swY + 10);
      sweatG.lineTo(swX - 8, swY + 10);
      sweatG.closePath();
      sweatG.fill(0x89CFF0);
      container.addChild(sweatG);
    }

    // ── Poop icons ──
    if (poops > 0) {
      for (let i = 0; i < Math.min(poops, 3); i++) {
        const poopG = new Graphics();
        const px = OX + (def.body.cx + def.body.rx + 10 + i * 20) * SCALE;
        const py = OY + (def.body.cy + def.body.ry - 5) * SCALE;
        poopG.ellipse(px, py, 8, 6);
        poopG.fill(0x8B4513);
        poopG.ellipse(px, py, 8, 6);
        poopG.stroke({ width: 1, color: 0x5C2E0A });
        poopG.arc(px, py - 3, 4, 0, Math.PI);
        poopG.stroke({ width: 1, color: 0x5C2E0A });
        container.addChild(poopG);
      }
    }

    stage.addChild(container);
    stage.addChild(effects);
    mainContainer.value = container;
    effectContainer.value = effects;
  }

  function startAnimation(): void {
    if (!app.value) return;
    const animate = (): void => {
      if (!app.value) return;

      if (clickBounce > 0) {
        clickBounce -= 0.5;
      }

      if (mainContainer.value) {
        const baseY = 0;
        const bounce = clickBounce > 0
          ? -clickBounce
          : moodAnim.value === 'happy'
            ? Math.sin(frameCount * 0.08) * 6
            : moodAnim.value === 'eating'
              ? Math.sin(frameCount * 0.15) * 4
              : moodAnim.value === 'sick'
                ? Math.sin(frameCount * 0.02) * 1
                : Math.sin(frameCount * 0.03) * 2.5;
        mainContainer.value.y = baseY + bounce;
      }

      // Float Zzz when sleeping
      if (effectContainer?.value && isSleeping.value) {
        const children = effectContainer.value.children;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children.forEach((child: any) => {
          if (child instanceof Text) {
            child.y -= 0.2;
            child.alpha = Math.max(0, child.alpha - 0.003);
          }
        });
      }

      frameCount++;
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
  }

  function destroy(): void {
    if (animFrame) cancelAnimationFrame(animFrame);
    app.value?.destroy(true);
  }

  watch(moodAnim, () => drawPet(), { deep: true });
  watch(pet, () => drawPet(), { deep: true });
  watch(poopCount, () => drawPet());
  watch(isSleeping, () => drawPet());
  watch(isSick, () => drawPet());

  return { init, drawPet, destroy };
}
