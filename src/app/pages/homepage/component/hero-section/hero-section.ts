import {
  Component,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
  NgZone
} from '@angular/core';

@Component({
  selector: 'app-hero-section',
  imports: [],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.css',
})
export class HeroSection implements AfterViewInit, OnDestroy {

  @ViewChild('heroVideo')
  heroVideo!: ElementRef<HTMLVideoElement>;

  @ViewChild('meterFill')
  meterFill!: ElementRef<HTMLDivElement>;

  @ViewChild('counter')
  counter!: ElementRef<HTMLDivElement>;

  @ViewChildren('slide')
  slides!: QueryList<ElementRef<HTMLElement>>;

  private duration = 0;
  private progress = 0;
  private desiredTime = 0;

  private virtualTime = 0;
  private lastTick = 0;
  private lastSeek = 0;

  private raf = 0;

  private readonly EASE_SECONDS = 0.015;
  private readonly SEEK_INTERVAL_MS = 2;
  private readonly SEEK_THRESHOLD = 0.035;

  private video!: HTMLVideoElement;
  private slideElements: HTMLElement[] = [];

  constructor(private ngZone: NgZone) {}

 @ViewChild('heroSection')
heroSection!: ElementRef<HTMLElement>;

ngAfterViewInit(): void {
  this.video = this.heroVideo.nativeElement;

  this.slideElements = Array.from(
    document.querySelectorAll<HTMLElement>('#hero .item')
  );

  this.video.muted = true;
  this.video.pause();

  this.video.addEventListener('loadedmetadata', this.onLoadedMetadata);
  this.video.addEventListener('seeked', this.onSeeked);

  window.addEventListener('scroll', this.onScroll, { passive: true });
  window.addEventListener('resize', this.onScroll, { passive: true });

  this.video.load();

  this.onScroll();
}

  private onLoadedMetadata = (): void => {

    this.duration = this.video.duration;

    this.video.pause();

    this.desiredTime =
      this.progress * Math.max(0, this.duration - 0.025);

    this.virtualTime = this.desiredTime;

    this.onScroll();
  };

  private onSeeked = (): void => {

    if (
      !this.raf &&
      Math.abs(this.desiredTime - this.video.currentTime) >
      this.SEEK_THRESHOLD
    ) {
      this.raf = requestAnimationFrame(this.tick);
    }

  };

  private onPlay = (): void => {
    this.video.pause();
  };

  private onVideoError = (): void => {
    console.warn('Unable to load background video.');
  };

  private clamp(
    value: number,
    min: number,
    max: number
  ): number {
    return Math.max(min, Math.min(max, value));
  }

  private onScroll = (): void => {

    const hero = document.getElementById('hero');

    if (!hero) return;

    const range = Math.max(
      1,
      hero.offsetHeight - window.innerHeight
    );

    this.progress = this.clamp(
      -hero.getBoundingClientRect().top / range,
      0,
      1
    );

    // Update progress meter
    this.meterFill.nativeElement.style.width =
      (this.progress * 100) + '%';

    // Update chapter counter
    this.counter.nativeElement.textContent =
      String(
        Math.min(4, Math.floor(this.progress * 4) + 1)
      ).padStart(2, '0') + ' — 04';

    // Animate chapter text
    this.slideElements.forEach((el, i) => {

      const local = this.progress * 4 - i;

      const opacity = this.clamp(
        Math.min(
          (local + 0.10) * 6,
          (1.10 - local) * 6
        ),
        0,
        1
      );

      el.style.opacity = String(opacity);

      el.style.transform =
        `translateY(calc(-35% + ${(1 - local) * 34}px))`;

      el.classList.toggle('on', opacity > 0.7);

    });

    // Calculate desired video time
    if (this.duration) {

      this.desiredTime =
        this.progress * Math.max(0, this.duration - 0.025);

      if (!this.raf) {
        this.raf = requestAnimationFrame(this.tick);
      }

    }

  };

  private tick = (now: number): void => {

    this.raf = 0;

    if (!this.duration) return;

    const dt = this.lastTick
      ? Math.min(0.08, (now - this.lastTick) / 1000)
      : 0.016;

    this.lastTick = now;

    const alpha =
      1 - Math.exp(-dt / this.EASE_SECONDS);

    this.virtualTime +=
      (this.desiredTime - this.virtualTime) * alpha;

    if (
      Math.abs(this.desiredTime - this.virtualTime) < 0.025
    ) {
      this.virtualTime = this.desiredTime;
    }

    if (
      now - this.lastSeek >= this.SEEK_INTERVAL_MS &&
      !this.video.seeking &&
      Math.abs(this.video.currentTime - this.virtualTime) >=
      this.SEEK_THRESHOLD
    ) {

      try {

        this.video.currentTime = this.clamp(
          this.virtualTime,
          0,
          this.duration - 0.025
        );

        this.lastSeek = now;

      } catch (error) {
        console.warn('Video seeking error:', error);
      }

    }

    if (
      Math.abs(this.desiredTime - this.video.currentTime) >
      this.SEEK_THRESHOLD ||
      this.video.seeking
    ) {

      this.raf = requestAnimationFrame(this.tick);

    } else {

      this.lastTick = 0;

    }

  };

  ngOnDestroy(): void {

    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener('resize', this.onScroll);

    if (this.video) {

      this.video.removeEventListener(
        'loadedmetadata',
        this.onLoadedMetadata
      );

      this.video.removeEventListener(
        'seeked',
        this.onSeeked
      );

      this.video.removeEventListener(
        'play',
        this.onPlay
      );

      this.video.removeEventListener(
        'error',
        this.onVideoError
      );

    }

    if (this.raf) {
      cancelAnimationFrame(this.raf);
    }

  }


  
}
