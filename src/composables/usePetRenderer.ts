import { ref, watch, type Ref } from 'vue';
import { Application, Graphics, Container } from 'pixi.js';
import type { Pet, Personality } from '@/types/pet';

export function usePetRenderer(canvasRef: Ref<HTMLDivElement | null>, pet: Ref<Pet | null>) {
  const app = ref<Application | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const petContainer = ref<any>(null);
  let animFrame = 0;
  let frameCount = 0;

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
    canvasRef.value.appendChild(pixiApp.canvas as HTMLCanvasElement);
    app.value = pixiApp;
    drawPet();
    startAnimation();
  }

  function drawPet(): void {
    if (!app.value || !pet.value) return;
    const stage = app.value.stage;
    if (petContainer.value) {
      stage.removeChild(petContainer.value);
      petContainer.value.destroy({ children: true });
    }
    const container = new Container();
    const g = new Graphics();
    const p = pet.value;
    const isHappy = p.stats.happiness > 60;
    const isTired = p.stats.health < 30;

    const baseSize = 30 + p.stats.level * 2 + p.appearance.formStage * 10;
    const size = Math.min(baseSize, 120);

    const colors: Record<Personality, number> = {
      lively: 0xFF6B35, quiet: 0x4ECDC4, foodie: 0xFFE66D,
      aloof: 0x95E1D3, curious: 0xAA96DA,
    };
    const mainColor = colors[p.dna.personality] || 0x4ECDC4;
    const darkColor = p.appearance.dominantType === 'strength' ? 0x8B4513
      : p.appearance.dominantType === 'intelligence' ? 0x191970
      : p.appearance.dominantType === 'agility' ? 0x228B22
      : 0x333333;

    g.circle(140, isTired ? 160 : 140, size * 0.6);
    g.fill(mainColor);
    g.circle(140, isTired ? 160 : 140, size * 0.6);
    g.stroke({ width: 3, color: darkColor });

    const eyeY = isTired ? 150 : 130;
    if (isHappy) {
      g.arc(120, eyeY, 8, Math.PI, 0);
      g.stroke({ width: 2, color: 0x000000 });
      g.arc(160, eyeY, 8, Math.PI, 0);
      g.stroke({ width: 2, color: 0x000000 });
    } else {
      g.circle(120, eyeY, 5);
      g.fill(0x000000);
      g.circle(160, eyeY, 5);
      g.fill(0x000000);
    }

    if (isHappy) {
      g.arc(140, eyeY + 20, 10, 0, Math.PI);
      g.stroke({ width: 2, color: 0x000000 });
    } else {
      g.circle(140, eyeY + 22, 3);
      g.fill(0x000000);
    }

    container.addChild(g);
    stage.addChild(container);
    petContainer.value = container;
  }

  function startAnimation(): void {
    if (!app.value) return;
    const animate = (): void => {
      if (!petContainer.value || !app.value) return;
      frameCount++;
      petContainer.value.y = Math.sin(frameCount * 0.03) * 3;
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
  }

  function destroy(): void {
    if (animFrame) cancelAnimationFrame(animFrame);
    app.value?.destroy(true);
  }

  watch(pet, () => drawPet(), { deep: true });

  return { init, drawPet, destroy };
}
