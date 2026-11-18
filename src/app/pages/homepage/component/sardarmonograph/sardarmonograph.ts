import { CommonModule } from '@angular/common';
import { afterNextRender, Component, ElementRef, inject, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-sardarmonograph',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sardarmonograph.html',
  styleUrl: './sardarmonograph.css',
  encapsulation: ViewEncapsulation.None,

})
export class Sardarmonograph implements OnDestroy {
private readonly host: ElementRef<HTMLElement> = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    afterNextRender(() => {
      if (!this.destroyed) this.initAnimations();
    });
  }
  private destroyed = false;
  private dustFrameId = 0;
  private animationFrameId = 0;
  private abortController = new AbortController();

  private initAnimations(): void {
    const component = this;
    const root: HTMLElement = this.host.nativeElement;
    const signal = this.abortController.signal;

    // Throw an actionable error instead of silently dereferencing null.
    const getElement = <T extends Element = HTMLElement>(selector: string): T => {
      const element = root.querySelector(selector);
      if (!element) throw new Error(`Sardarmonograph: missing element ${selector}`);
      return element as T;
    };

            /* =========================================================================
               1. AMBIENT ARCHITECTURAL GOLD DUST LAYER
               ========================================================================= */
            const canvas = getElement<HTMLCanvasElement>('#ambientDustCanvas');
            const context = canvas.getContext('2d');
            if (!context) return;
            const ctx: CanvasRenderingContext2D = context;
            const motes: Array<{ x: number; y: number; r: number; vx: number; vy: number; a: number }> = [];

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
            window.addEventListener('resize', resizeCanvas, { signal: signal });
            resizeCanvas();

            for (let i = 0; i < 32; i++) {
                motes.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    r: Math.random() * 1.4 + 0.3,
                    vx: (Math.random() - 0.5) * 0.14,
                    vy: -(Math.random() * 0.18 + 0.04),
                    a: Math.random() * 0.35 + 0.08
                });
            }

            function renderDust() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                for (const m of motes) {
                    m.x += m.vx;
                    m.y += m.vy;
                    if (m.y < -10) {
                        m.y = canvas.height + 10;
                        m.x = Math.random() * canvas.width;
                    }
                    ctx.beginPath();
                    ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(212, 175, 55, ${m.a})`;
                    ctx.fill();
                }
                if (!component.destroyed) component.dustFrameId = requestAnimationFrame(renderDust);
            }
            renderDust();


            /* =========================================================================
               2. INERTIAL SCROLL CHOREOGRAPHY STATE & MATH UTILITIES
               ========================================================================= */
            let targetProgress = 0;
            let currentProgress = 0;

            const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);
            const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
            const seg = (v: number, start: number, end: number) => clamp((v - start) / (end - start), 0, 1);
            const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
            const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

            // Chapter DOM Elements
            const chapters = [
                getElement('#chapter1'),
                getElement('#chapter2'),
                getElement('#chapter3'),
                getElement('#chapter4'),
                getElement('#chapter5')
            ];

            // Chapter 01 Elements
            const c1Watermark = getElement('#c1Watermark');
            const c1HorizonLine = getElement('#c1HorizonLine');
            const c1Title = getElement('#c1Title');
            const c1Meta = getElement('#c1Meta');
            const yearsCounter = getElement('#yearsCounter');

            // Chapter 02 Elements
            const consultationsCounter = getElement('#consultationsCounter');
            const c2VerticalLine = getElement('#c2VerticalLine');
            const c2Left = getElement('#c2Left');
            const c2Right = getElement('#c2Right');

            // Chapter 03 Elements
            const practiceRows = root.querySelectorAll<HTMLElement>('.practice-row');

            // Chapter 04 Elements
            const compassOuterRing = getElement<SVGElement>('#compassOuterRing');
            const compassInnerRing = getElement<SVGElement>('#compassInnerRing');
            const c4Left = getElement('#c4Left');
            const c4Right = getElement('#c4Right');

            // Chapter 05 Elements
            const emeraldAtmosphere = getElement('#emeraldAtmosphere');
            const covenantLines = root.querySelectorAll<HTMLElement>('.covenant-line');
            const c5SignatureRule = getElement('#c5SignatureRule');
            const c5Signature = getElement('#c5Signature');

            // Navigation & HUD Elements
            const scrubberTrack = getElement('#scrubberTrack');
            const scrubberFill = getElement('#scrubberFill');
            const desktopTicks = root.querySelectorAll<HTMLElement>('.chapter-tick');
            const mobileTicks = root.querySelectorAll<HTMLElement>('.mobile-tick');


    /* Page section scroll controls: normal document scroll is never blocked. */
    const section: HTMLElement = root.querySelector<HTMLElement>('#firm-monograph') ?? root;
    const scrollStage = getElement<HTMLElement>('#scrollStage');
    const ticks = [...Array.from(desktopTicks), ...Array.from(mobileTicks)];

    const sectionMetrics = (): { start: number; travel: number } => {
      const start = section.getBoundingClientRect().top + window.scrollY;
      return {
        start,
        travel: Math.max(1, section.offsetHeight - scrollStage.offsetHeight)
      };
    };

    const scrollToProgress = (value: number): void => {
      const { start, travel } = sectionMetrics();
      window.scrollTo({
        top: start + clamp(value, 0, 1) * travel,
        behavior: 'smooth'
      });
    };

    ticks.forEach((tick: HTMLElement) => {
      tick.addEventListener('click', () => {
        scrollToProgress(Number(tick.dataset['target'] ?? '0'));
      }, { signal });
    });

    const scrubTo = (clientX: number): void => {
      const rect = scrubberTrack.getBoundingClientRect();
      if (!rect.width) return;
      scrollToProgress((clientX - rect.left) / rect.width);
    };

    scrubberTrack.addEventListener('click', (event: MouseEvent) => {
      scrubTo(event.clientX);
    }, { signal });

    practiceRows.forEach((row: HTMLElement) => {
      row.addEventListener('click', () => {
        const open = row.classList.contains('is-expanded');
        practiceRows.forEach((item: HTMLElement) => item.classList.remove('is-expanded'));
        if (!open) row.classList.add('is-expanded');
      }, { signal });
    });

            /* =========================================================================
               4. 60FPS EDITORIAL SCROLL CHOREOGRAPHY ENGINE
               ========================================================================= */
             function animate(): void {
                 // Derive chapter animation progress from section position in the page.
                 // When this section reaches its final chapter, regular scrolling
                 // naturally continues to the next page section.
                 const { start, travel } = sectionMetrics();
                 targetProgress = clamp((window.scrollY - start) / travel, 0, 1);
                 currentProgress = lerp(currentProgress, targetProgress, 0.14);
                const p = currentProgress;

                /* ---------------------------------------------------------------------
                   CHAPTER 01 — THE LEGACY (1996) [Active Window: 0.00 -> 0.22]
                   --------------------------------------------------------------------- */
                const c1Out = easeInOutCubic(seg(p, 0.11, 0.23));
                const c1Opacity = 1 - c1Out;
                chapters[0].style.opacity = c1Opacity.toFixed(3);
                chapters[0].style.transform = `translate3d(0, ${-c1Out * 55}px, 0)`;
                chapters[0].classList.toggle('is-interactive', p < 0.16);

                // Monumental "1996" deep horizontal/vertical parallax drift
                const driftX = (p * 180);
                const driftY = (-p * 90);
                c1Watermark.style.transform = `translate3d(${driftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0)`;

                // Self-drawing gold horizon line & live 28+ counter
                const lineDraw1 = easeOutCubic(clamp(0.45 + p * 4.5, 0, 1)) * (1 - c1Out * 0.4);
                c1HorizonLine.style.transform = `scaleX(${lineDraw1.toFixed(3)})`;
                c1Title.style.transform = `translate3d(0, ${-c1Out * 22}px, 0)`;
                c1Meta.style.transform = `translate3d(0, ${c1Out * 16}px, 0)`;

                const yrFactor = easeOutCubic(clamp(0.35 + p * 6.5, 0, 1));
                yearsCounter.textContent = String(Math.round(yrFactor * 28));


                /* ---------------------------------------------------------------------
                   CHAPTER 02 — PROVEN SCALE [Active Window: 0.16 -> 0.46, Peak: 0.25]
                   --------------------------------------------------------------------- */
                const c2In = easeOutCubic(seg(p, 0.15, 0.25));
                const c2Out = easeInOutCubic(seg(p, 0.35, 0.47));
                const c2Opacity = c2In * (1 - c2Out);

                chapters[1].style.opacity = c2Opacity.toFixed(3);
                chapters[1].style.transform = `translate3d(0, ${(1 - c2In) * 45 - c2Out * 45}px, 0)`;
                chapters[1].classList.toggle('is-interactive', p >= 0.18 && p <= 0.40);

                c2Left.style.transform = `translate3d(${(1 - c2In) * -32}px, 0, 0)`;
                c2Right.style.transform = `translate3d(${(1 - c2In) * 32}px, 0, 0)`;
                c2VerticalLine.style.transform = `scaleY(${c2In.toFixed(3)})`;

                // Live 5,000+ sculptural counter
                const consultFactor = easeOutCubic(seg(p, 0.16, 0.27));
                consultationsCounter.textContent = Math.round(consultFactor * 5000).toLocaleString();


                /* ---------------------------------------------------------------------
                   CHAPTER 03 — FOUR PILLARS OF PRACTICE [Window: 0.40 -> 0.71, Peak: 0.50]
                   --------------------------------------------------------------------- */
                const c3In = easeOutCubic(seg(p, 0.39, 0.50));
                const c3Out = easeInOutCubic(seg(p, 0.60, 0.72));
                const c3Opacity = c3In * (1 - c3Out);

                chapters[2].style.opacity = c3Opacity.toFixed(3);
                chapters[2].style.transform = `translate3d(0, ${(1 - c3In) * 40 - c3Out * 40}px, 0)`;
                chapters[2].classList.toggle('is-interactive', p >= 0.43 && p <= 0.65);

                // Sequential editorial row wipe-in
                practiceRows.forEach((row, idx) => {
                    const rowProg = easeOutCubic(seg(p, 0.39 + idx * 0.022, 0.48 + idx * 0.022));
                    row.style.opacity = rowProg.toFixed(3);
                    row.style.transform = `translate3d(${(1 - rowProg) * 36}px, 0, 0)`;
                });


                /* ---------------------------------------------------------------------
                   CHAPTER 04 — MULTI-JURISDICTIONAL AUTHORITY [Window: 0.64 -> 0.90, Peak: 0.75]
                   --------------------------------------------------------------------- */
                const c4In = easeOutCubic(seg(p, 0.64, 0.75));
                const c4Out = easeInOutCubic(seg(p, 0.82, 0.92));
                const c4Opacity = c4In * (1 - c4Out);

                chapters[3].style.opacity = c4Opacity.toFixed(3);
                chapters[3].style.transform = `translate3d(0, ${(1 - c4In) * 40 - c4Out * 40}px, 0)`;
                chapters[3].classList.toggle('is-interactive', p >= 0.68 && p <= 0.86);

                // Scroll-driven architectural compass meridian rotation
                const compassAngle = (p - 0.64) * 420;
                compassOuterRing.style.transform = `rotate(${compassAngle.toFixed(1)}deg)`;
                compassInnerRing.style.transform = `rotate(${(-compassAngle * 0.65).toFixed(1)}deg)`;

                c4Left.style.transform = `translate3d(${(1 - c4In) * -28}px, 0, 0)`;
                c4Right.style.transform = `translate3d(${(1 - c4In) * 28}px, 0, 0)`;


                /* ---------------------------------------------------------------------
                   CHAPTER 05 — THE FOUNDING COVENANT [Window: 0.84 -> 1.00]
                   --------------------------------------------------------------------- */
                const c5In = easeOutCubic(seg(p, 0.83, 0.92));
                chapters[4].style.opacity = c5In.toFixed(3);
                chapters[4].style.transform = `translate3d(0, ${(1 - c5In) * 35}px, 0)`;
                chapters[4].classList.toggle('is-interactive', p >= 0.86);

                // Full-bleed deep emerald atmospheric transition
                const emeraldOpacity = easeInOutCubic(seg(p, 0.82, 0.95));
                emeraldAtmosphere.style.opacity = emeraldOpacity.toFixed(3);

                // Line-by-line quote illumination from muted slate to crisp ivory
                covenantLines.forEach((line, idx) => {
                    const lineStart = 0.85 + idx * 0.032;
                    const lineEnd = lineStart + 0.045;
                    const lit = easeOutCubic(seg(p, lineStart, lineEnd));
                    const alpha = 0.22 + lit * 0.78;
                    line.style.color = `rgba(244, 243, 239, ${alpha.toFixed(3)})`;
                    line.style.transform = `translate3d(0, ${(1 - lit) * 10}px, 0)`;
                });

                // Self-drawing signature rule & firm signature reveal
                const sigProg = easeOutCubic(seg(p, 0.94, 1.0));
                c5SignatureRule.style.transform = `scaleX(${sigProg.toFixed(3)})`;
                c5Signature.style.opacity = sigProg.toFixed(3);
                c5Signature.style.transform = `translate3d(0, ${(1 - sigProg) * 12}px, 0)`;


                /* ---------------------------------------------------------------------
                   UPDATE MINIMALIST CHAPTER TICKS & HAIRLINE SCRUBBER
                   --------------------------------------------------------------------- */
                scrubberFill.style.width = `${(p * 100).toFixed(2)}%`;

                const activeChapterIdx = Math.min(4, Math.round(p * 4));

                desktopTicks.forEach((tick, idx) => {
                    tick.classList.toggle('active', idx === activeChapterIdx);
                });

                mobileTicks.forEach((tick, idx) => {
                    tick.classList.toggle('text-goldPale', idx === activeChapterIdx);
                    tick.classList.toggle('font-semibold', idx === activeChapterIdx);
                });

                if (!component.destroyed) component.animationFrameId = requestAnimationFrame(animate);
            }

            if (!component.destroyed) component.animationFrameId = requestAnimationFrame(animate);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.abortController.abort();
    cancelAnimationFrame(this.dustFrameId);
    cancelAnimationFrame(this.animationFrameId);
  }
}
