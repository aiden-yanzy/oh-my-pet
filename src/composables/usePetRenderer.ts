import { ref, watch, type Ref } from 'vue';
import { Application, Graphics, Container, Text } from 'pixi.js';
import type { Pet, Personality } from '@/types/pet';

export type PetAnimState = 'idle' | 'eating' | 'happy' | 'sleeping' | 'sick' | 'poop';

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
  const petContainer = ref<any>(null);
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
    // Brief happy reaction
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

  function drawPet(): void {
    if (!app.value || !pet.value) return;
    const stage = app.value.stage;
    // Clear previous
    if (petContainer.value) {
      stage.removeChild(petContainer.value);
      petContainer.value.destroy({ children: true });
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

    const baseSize = 30 + p.stats.level * 2 + p.appearance.formStage * 10;
    const size = Math.min(baseSize, 120);

    const colors: Record<Personality, number> = {
      lively: 0xFF6B35, quiet: 0x4ECDC4, foodie: 0xFFE66D,
      aloof: 0x95E1D3, curious: 0xAA96DA,
    };
    let mainColor = colors[p.dna.personality] || 0x4ECDC4;
    if (sick) {
      // Desaturate when sick
      mainColor = blendColor(mainColor, 0x888888, 0.5);
    }
    const darkColor = p.appearance.dominantType === 'strength' ? 0x8B4513
      : p.appearance.dominantType === 'intelligence' ? 0x191970
      : p.appearance.dominantType === 'agility' ? 0x228B22
      : 0x333333;

    const bodyY = sick ? 160 : sleeping ? 155 : 140;
    const radius = size * 0.6;

    // Body
    g.circle(140, bodyY, radius);
    g.fill(mainColor);
    g.circle(140, bodyY, radius);
    g.stroke({ width: 3, color: darkColor });

    const eyeY = sick ? bodyY + 8 : sleeping ? bodyY + 5 : bodyY - 10;

    if (sleeping || sick) {
      // Closed / droopy eyes
      g.moveTo(112, eyeY);
      g.lineTo(128, eyeY);
      g.stroke({ width: sick ? 2 : 3, color: 0x000000 });
      g.moveTo(152, eyeY);
      g.lineTo(168, eyeY);
      g.stroke({ width: sick ? 2 : 3, color: 0x000000 });

      if (sick) {
        // Dark circles under eyes
        g.circle(120, eyeY + 8, 8);
        g.fill(0x000000, 0.15);
        g.circle(160, eyeY + 8, 8);
        g.fill(0x000000, 0.15);
        // Droopy mouth
        g.arc(140, eyeY + 22, 8, Math.PI * 0.2, Math.PI * 0.8);
        g.stroke({ width: 2, color: 0x000000 });
      } else {
        // Sleeping smile
        g.arc(140, eyeY + 18, 6, 0, Math.PI);
        g.stroke({ width: 2, color: 0x000000 });
      }
    } else if (state === 'eating' || state === 'happy') {
      // Happy eyes (arcs)
      g.arc(112, eyeY, 9, Math.PI, 0);
      g.stroke({ width: 2, color: 0x000000 });
      g.arc(168, eyeY, 9, Math.PI, 0);
      g.stroke({ width: 2, color: 0x000000 });
      // Big smile
      g.arc(140, eyeY + 25, 14, 0.1, Math.PI - 0.1);
      g.stroke({ width: 2.5, color: 0x000000 });

      if (state === 'eating') {
        // Food near mouth
        g.circle(160, eyeY + 20, 6);
        g.fill(0xFF8C00);
        g.circle(160, eyeY + 20, 6);
        g.stroke({ width: 1.5, color: 0xCC6600 });
      }
      if (state === 'happy') {
        // Rosy cheeks
        g.circle(110, eyeY + 18, 7);
        g.fill(0xFF6B6B, 0.4);
        g.circle(170, eyeY + 18, 7);
        g.fill(0xFF6B6B, 0.4);
      }
    } else {
      // Normal idle eyes
      g.circle(120, eyeY, 6);
      g.fill(0x000000);
      g.circle(160, eyeY, 6);
      g.fill(0x000000);
      // Mouth
      g.circle(140, eyeY + 24, 4);
      g.fill(0x000000);
    }

    container.addChild(g);

    // Poop icons
    if (poops > 0) {
      for (let i = 0; i < Math.min(poops, 3); i++) {
        const poopG = new Graphics();
        const px = 80 + i * 30;
        const py = bodyY + radius + 20;
        poopG.ellipse(px, py, 10, 8);
        poopG.fill(0x8B4513);
        poopG.ellipse(px, py, 10, 8);
        poopG.stroke({ width: 1.5, color: 0x5C2E0A });
        // Swirl on top
        poopG.arc(px, py - 4, 5, 0, Math.PI);
        poopG.stroke({ width: 1.5, color: 0x5C2E0A });
        container.addChild(poopG);
      }
    }

    // Sleeping Zzz
    if (sleeping) {
      ['z', 'z', 'z'].forEach((letter, i) => {
        const zText = new Text({
          text: letter,
          style: { fontSize: 16 - i * 3, fill: 0x89CFF0 },
        });
        zText.anchor.set(0.5);
        zText.x = 200 + i * 10;
        zText.y = 60 - i * 15;
        effects.addChild(zText);
      });
    }

    // Sick effects
    if (sick) {
      const sweatG = new Graphics();
      // Sweat drop
      sweatG.moveTo(100, 70);
      sweatG.lineTo(97, 78);
      sweatG.lineTo(103, 78);
      sweatG.closePath();
      sweatG.fill(0x89CFF0);
      container.addChild(sweatG);
    }

    stage.addChild(container);
    stage.addChild(effects);
    petContainer.value = container;
    effectContainer.value = effects;
  }

  function startAnimation(): void {
    if (!app.value) return;
    const animate = (): void => {
      if (!app.value) return;
      const state = moodAnim.value;

      if (clickBounce > 0) {
        clickBounce -= 0.5;
      }

      if (petContainer.value) {
        const baseY = state === 'sleeping' ? 3 : 0;
        const bounce = clickBounce > 0
          ? -clickBounce
          : state === 'happy'
            ? Math.sin(frameCount * 0.08) * 8
            : state === 'eating'
              ? Math.sin(frameCount * 0.15) * 5
              : state === 'sick'
                ? Math.sin(frameCount * 0.02) * 1
                : Math.sin(frameCount * 0.03) * 3;
        petContainer.value.y = baseY + bounce;
      }

      // Float Zzz when sleeping
      if (effectContainer?.value && isSleeping.value) {
        const children = effectContainer.value.children;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        children.forEach((child: any, _i: number) => {
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

  // Redraw when mood or state changes
  watch(moodAnim, () => drawPet(), { deep: true });
  watch(pet, () => drawPet(), { deep: true });
  watch(poopCount, () => drawPet());
  watch(isSleeping, () => drawPet());
  watch(isSick, () => drawPet());

  return { init, drawPet, destroy };
}

function blendColor(c1: number, c2: number, ratio: number): number {
  const r = ((c1 >> 16) & 0xFF) * (1 - ratio) + ((c2 >> 16) & 0xFF) * ratio;
  const g = ((c1 >> 8) & 0xFF) * (1 - ratio) + ((c2 >> 8) & 0xFF) * ratio;
  const b = (c1 & 0xFF) * (1 - ratio) + (c2 & 0xFF) * ratio;
  return (Math.round(r) << 16) | (Math.round(g) << 8) | Math.round(b);
}
