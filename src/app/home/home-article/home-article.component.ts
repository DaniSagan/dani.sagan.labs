import { RandomDiscoveryComponent } from '../../shared/random-discovery/random-discovery.component';
import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-article',
  templateUrl: './home-article.component.html',
  styleUrls: ['./home-article.component.css'],
  standalone: true,
  imports: [RandomDiscoveryComponent, RouterLink],
})
export class HomeArticleComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('progress') private progressRef!: ElementRef<HTMLElement>;
  readonly scenes = [
    {
      code: 'SYS.01',
      domain: 'Sistemas dinámicos',
      label: 'Caos',
      title: 'La geometría del caos',
      caption:
        'Una trayectoria que nunca se repite. El atractor de Lorenz dibuja el orden oculto en el caos.',
      formula: 'σ = 10 · ρ = 28 · β = 8/3',
      route: '/articles/lorenz-attractor',
      description:
        'Trayectoria tridimensional del atractor de Lorenz, girando en tonos de cian, violeta y oro.',
    },
    {
      code: 'NUM.02',
      domain: 'Números y naturaleza',
      label: 'Orden',
      title: 'El ritmo de la naturaleza',
      caption:
        'Un ángulo áureo, cientos de semillas. Las espirales de la filotaxis conectan los números con la naturaleza.',
      formula: 'θ = n · 137,508°',
      route: '/articles/fibonacci-numbers',
      description:
        'Semillas luminosas dispuestas en espirales mediante el ángulo áureo.',
    },
    {
      code: 'GEO.03',
      domain: 'Curvas y armonía',
      label: 'Ondas',
      title: 'Frecuencias que dibujan',
      caption:
        'Dos oscilaciones se encuentran. Sus frecuencias trazan las simetrías de las curvas de Lissajous.',
      formula: 'x = sin(3t + δ) · y = sin(2t)',
      route: '/articles/lissajous',
      description:
        'Familia de curvas de Lissajous luminosas que varían su fase lentamente.',
    },
    {
      code: 'PRB.04',
      domain: 'Probabilidad',
      label: 'Azar',
      title: 'La forma del azar',
      caption:
        'Cada caída es impredecible. Juntas, las bolas del tablero de Galton revelan una distribución binomial.',
      formula: 'X ∼ Bin(10, ½)',
      route: '/articles/galton-board',
      description:
        'Bolas cayendo entre diez filas de clavijas y una distribución binomial ilustrada debajo.',
    },
  ];
  sceneIndex = 0;
  paused =
    typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches;
  get activeScene() {
    return this.scenes[this.sceneIndex];
  }
  private context: CanvasRenderingContext2D | null = null;
  private frame = 0;
  private resizeObserver?: ResizeObserver;
  private intersectionObserver?: IntersectionObserver;
  private motion?: MediaQueryList;
  private visible = true;
  private destroyed = false;
  private lastTime = 0;
  private time = 0;
  private sceneTime = 0;
  private width = 300;
  private height = 324;
  private pointer = { x: 0, y: 0 };
  private readonly lorenz: number[][] = [];
  private readonly motionChanged = () => {
    this.zone.run(() => {
      this.paused = !!this.motion?.matches;
    });
    this.lastTime = 0;
    this.render();
    this.schedule();
  };
  private readonly visibilityChanged = () => {
    this.lastTime = 0;
    this.schedule();
  };

  constructor(private readonly zone: NgZone) {
    let x = 0.1,
      y = 0,
      z = 0;
    for (let i = 0; i < 6800; i++) {
      const dt = 0.005;
      const dx = 10 * (y - x),
        dy = x * (28 - z) - y,
        dz = x * y - (8 / 3) * z;
      x += dx * dt;
      y += dy * dt;
      z += dz * dt;
      if (i > 600) this.lorenz.push([x, y, z - 25]);
    }
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.context = canvas.getContext('2d');
    this.motion = matchMedia('(prefers-reduced-motion: reduce)');
    this.motion.addEventListener('change', this.motionChanged);
    document.addEventListener('visibilitychange', this.visibilityChanged);
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        const bounds = canvas.getBoundingClientRect();
        this.width = bounds.width;
        this.height = bounds.height;
        const ratio = Math.min(devicePixelRatio || 1, 2);
        canvas.width = Math.round(this.width * ratio);
        canvas.height = Math.round(this.height * ratio);
        this.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.render();
      });
      this.resizeObserver.observe(canvas);
      this.intersectionObserver = new IntersectionObserver((entries) => {
        this.visible = entries[0].isIntersecting;
        this.lastTime = 0;
        this.schedule();
      });
      this.intersectionObserver.observe(canvas);
      this.schedule();
    });
  }

  selectScene(index: number): void {
    this.sceneIndex = index;
    this.sceneTime = 0;
    this.render();
  }
  togglePause(): void {
    this.paused = !this.paused;
    this.lastTime = 0;
    this.schedule();
  }
  movePointer(event: PointerEvent): void {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.pointer = {
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    };
    if (this.paused && !this.motion?.matches) this.render();
  }
  resetPointer(): void {
    this.pointer = { x: 0, y: 0 };
  }

  private schedule(): void {
    if (
      this.destroyed ||
      this.frame ||
      this.paused ||
      !this.visible ||
      document.hidden ||
      !this.context
    )
      return;
    this.zone.runOutsideAngular(() => {
      this.frame = requestAnimationFrame((now) => {
        this.frame = 0;
        if (this.paused || !this.visible || document.hidden) {
          this.lastTime = 0;
          return;
        }
        const dt = this.lastTime
          ? Math.min((now - this.lastTime) / 1000, 0.05)
          : 0;
        this.lastTime = now;
        this.time += dt;
        this.sceneTime += dt;
        if (this.sceneTime >= 14)
          this.zone.run(() =>
            this.selectScene((this.sceneIndex + 1) % this.scenes.length),
          );
        this.render();
        this.schedule();
      });
    });
  }

  private render(): void {
    const ctx = this.context;
    if (!ctx || !this.width || !this.height) return;
    ctx.clearRect(0, 0, this.width, this.height);
    ctx.save();
    // Fade between exhibits; reduced motion retains a complete, static drawing.
    ctx.globalAlpha = this.paused
      ? 1
      : Math.min(1, (this.sceneTime + 0.15) / 0.8, (14 - this.sceneTime) / 0.8);
    ctx.translate(this.width / 2, this.height / 2);
    const scale = Math.min(this.width, this.height) / 300;
    ctx.scale(scale, scale);
    ctx.lineCap = 'round';
    for (let i = 0; i < 36; i++) {
      const x = Math.sin(i * 127.1) * 142,
        y = Math.cos(i * 311.7) * 142;
      ctx.fillStyle = `rgba(177,196,233,${0.15 + 0.12 * Math.sin(this.time * 0.6 + i)})`;
      ctx.fillRect(x, y, 1, 1);
    }
    if (this.sceneIndex === 0) this.drawLorenz(ctx);
    else if (this.sceneIndex === 1) this.drawSeeds(ctx);
    else if (this.sceneIndex === 2) this.drawWaves(ctx);
    else this.drawGalton(ctx);
    ctx.restore();
    this.progressRef.nativeElement.style.transform = `scaleX(${this.sceneTime / 14})`;
  }

  private drawLorenz(ctx: CanvasRenderingContext2D): void {
    const angle = this.time * 0.12 + this.pointer.x * 0.9;
    const points = this.lorenz.map(([x, y, z]) => {
      const rx = x * Math.cos(angle) - y * Math.sin(angle);
      const depth = x * Math.sin(angle) + y * Math.cos(angle);
      const perspective = 180 / (180 + depth);
      return [
        rx * 4.1 * perspective,
        (-z + depth * (0.22 + this.pointer.y * 0.3)) * 4.1 * perspective,
      ];
    });
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 1; i < points.length; i += 12) {
      const hue = 175 + (i / points.length) * 110;
      ctx.beginPath();
      ctx.moveTo(...(points[i - 1] as [number, number]));
      for (let j = i; j < Math.min(i + 12, points.length); j++)
        ctx.lineTo(...(points[j] as [number, number]));
      ctx.strokeStyle = `hsla(${hue}, 85%, 68%, .42)`;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }
    const head = Math.floor(this.time * 260) % points.length;
    for (let i = 0; i < 80; i++) {
      const p = points[(head + i) % points.length];
      ctx.fillStyle = `rgba(255,216,147,${i / 80})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], i === 79 ? 2.7 : 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawSeeds(ctx: CanvasRenderingContext2D): void {
    ctx.rotate(this.time * 0.035 + this.pointer.x * 0.2);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 620; i++) {
      const angle = i * Math.PI * (3 - Math.sqrt(5));
      const radius = Math.sqrt(i) * 5;
      const pulse = 1 + 0.025 * Math.sin(radius * 0.07 - this.time * 1.4);
      ctx.fillStyle = `hsla(${35 + (i / 620) * 175}, 78%, ${60 + 12 * Math.sin(i * 0.03 - this.time)}%, .8)`;
      ctx.beginPath();
      ctx.ellipse(
        Math.cos(angle) * radius * pulse,
        Math.sin(angle) * radius * pulse,
        1.3 + (i / 620) * 0.9,
        2.4,
        angle,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }

  private drawWaves(ctx: CanvasRenderingContext2D): void {
    ctx.globalCompositeOperation = 'lighter';
    for (let band = 0; band < 22; band++) {
      ctx.beginPath();
      for (let i = 0; i <= 420; i++) {
        const t = (i / 420) * Math.PI * 2;
        const phase = this.time * 0.23 + band * 0.035 + this.pointer.x * 0.5;
        const r = 108 - band * 1.1;
        const x = Math.sin(3 * t + phase) * r,
          y = Math.sin(2 * t) * r;
        if (!i) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = `hsla(${185 + band * 5}, 90%, 70%, .24)`;
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
  }

  private drawGalton(ctx: CanvasRenderingContext2D): void {
    const step = 20,
      top = -108;
    for (let row = 0; row < 10; row++) {
      for (let col = 0; col <= row; col++) {
        ctx.fillStyle = '#758bab';
        ctx.beginPath();
        ctx.arc((col - row / 2) * step, top + row * 18, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Deterministic fair left/right paths, staggered in time.
    for (let ball = 0; ball < 28; ball++) {
      const age = ((this.time * 0.65 + ball / 28) % 1) * 11;
      const row = Math.floor(age);
      let x = 0;
      for (let j = 0; j < row; j++) x += (this.direction(ball, j) * step) / 2;
      x += ((this.direction(ball, row) * step) / 2) * (age - row);
      ctx.fillStyle = ball % 3 ? '#8adce9' : '#f2c67e';
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(x, top - 18 + age * 18, 2.6, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    const bins = [1, 10, 45, 120, 210, 252, 210, 120, 45, 10, 1];
    bins.forEach((count, i) => {
      const height = (count / 252) * 39;
      const gradient = ctx.createLinearGradient(0, 130 - height, 0, 130);
      gradient.addColorStop(0, '#e9bd79');
      gradient.addColorStop(1, '#a082dc55');
      ctx.fillStyle = gradient;
      ctx.fillRect((i - 5) * step - 7, 130 - height, 14, height);
    });
  }
  private direction(ball: number, row: number): number {
    const hash = Math.sin((ball + 1) * 127.1 + (row + 1) * 311.7) * 43758.5453;
    return hash - Math.floor(hash) < 0.5 ? -1 : 1;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.frame);
    this.resizeObserver?.disconnect();
    this.intersectionObserver?.disconnect();
    this.motion?.removeEventListener('change', this.motionChanged);
    document.removeEventListener('visibilitychange', this.visibilityChanged);
  }
}
