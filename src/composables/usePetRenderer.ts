import type { Pet, PetAnimState, PixelGrid } from '@/types/pet';
import { getPetStyle } from '@/data/petStyles';
import { getAccessory } from '@/data/accessories';

import { ref, watch, type Ref } from 'vue';
import { Application, Graphics, Container, Text } from 'pixi.js';

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
      antialias: false,
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

  /** Draw a pixel grid as filled rectangles */
  function drawGrid(
    g: Graphics,
    grid: PixelGrid,
    offsetX: number,
    offsetY: number,
    pixelSize: number,
  ): void {
    for (let y = 0; y < grid.length; y++) {
      const row = grid[y];
      if (!row) continue;
      for (let x = 0; x < row.length; x++) {
        const color = row[x];
        if (color) {
          const px = offsetX + x * pixelSize;
          const py = offsetY + y * pixelSize;
          g.rect(px, py, pixelSize, pixelSize);
          g.fill(color);
        }
      }
    }
  }

  /** Parse a hex color string to a number */
  function hexToNum(hex: string): number {
    return parseInt(hex.replace('#', ''), 16);
  }

  /** Blend two RGB colors by ratio */
  function blendColorStr(c1: string, c2: string, ratio: number): string {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 * (1 - ratio) + r2 * ratio);
    const g = Math.round(g1 * (1 - ratio) + g2 * ratio);
    const b = Math.round(b1 * (1 - ratio) + b2 * ratio);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /** Desaturate a pixel grid for sick state */
  function desaturateGrid(grid: PixelGrid): PixelGrid {
    return grid.map(row =>
      row.map(pixel => {
        if (!pixel) return null;
        const gray = blendColorStr(pixel, '#888888', 0.5);
        return gray;
      })
    );
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

    // ── Get pixel grid for current state ──
    const style = getPetStyle(p.appearance.styleId);
    if (!style) return;

    // Map state to frame key
    let frameKey: PetAnimState = state;
    if (state === 'poop') frameKey = 'idle';

    // Get grid for this frame
    let grid = style.sprites.frames[frameKey] ?? style.sprites.frames.idle;
    if (!grid) return;

    // Desaturate if sick
    if (sick) {
      grid = desaturateGrid(grid);
    }

    // ── Calculate layout ──
    const maxGridW = style.sprites.width;
    const maxGridH = style.sprites.height;
    const pixelSize = Math.min(
      Math.floor(200 / maxGridW),
      Math.floor(200 / maxGridH),
    );
    const totalW = maxGridW * pixelSize;
    const totalH = maxGridH * pixelSize;
    const offsetX = Math.floor((280 - totalW) / 2);
    const offsetY = Math.floor((120 - totalH) / 2) + 30; // slightly above center

    // ── Draw shadow under pet ──
    g.ellipse(140, offsetY + totalH + 8, totalW / 3, 6);
    g.fill(0x000000, 0.1);

    // ── Draw pixel grid ──
    drawGrid(g, grid, offsetX, offsetY, pixelSize);

    // ── Draw equipped accessories ──
    const equippedIds = p.appearance.accessories ?? [];
    for (const accId of equippedIds) {
      const acc = getAccessory(accId);
      if (!acc) continue;
      const accOffsetX = offsetX + acc.anchorX * pixelSize;
      const accOffsetY = offsetY + acc.anchorY * pixelSize;
      drawGrid(g, acc.grid, accOffsetX, accOffsetY, pixelSize);
    }

    container.addChild(g);

    // ── Eating: food particle near mouth ──
    if (state === 'eating') {
      const foodG = new Graphics();
      foodG.circle(offsetX + totalW + 8, offsetY + totalH * 0.4, 6);
      foodG.fill(0xFF8C00);
      foodG.circle(offsetX + totalW + 8, offsetY + totalH * 0.4, 6);
      foodG.stroke({ width: 1.5, color: 0xCC6600 });
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
        zText.x = offsetX + totalW + 10 + i * 10;
        zText.y = offsetY - 10 - i * 15;
        effects.addChild(zText);
      });
    }

    // ── Sick effects ──
    if (sick) {
      const sweatG = new Graphics();
      sweatG.moveTo(offsetX - 5, offsetY);
      sweatG.lineTo(offsetX - 8, offsetY + 8);
      sweatG.lineTo(offsetX - 2, offsetY + 8);
      sweatG.closePath();
      sweatG.fill(0x89CFF0);
      container.addChild(sweatG);
    }

    // ── Poop icons ──
    if (poops > 0) {
      for (let i = 0; i < Math.min(poops, 3); i++) {
        const poopG = new Graphics();
        const px = offsetX + totalW + 10 + i * 20;
        const py = offsetY + totalH - 10;
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
