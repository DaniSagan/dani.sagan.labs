import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  InjectionToken,
  NgZone,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LIFE_CATEGORIES,
  LifeBounds,
  LifeMessage,
  LifePattern,
  LifeView,
  fitLifeView,
  normalizedLifeSearch,
  zoomLifeView,
} from './game-of-life.model';

export const LIFE_WORKER_FACTORY = new InjectionToken<() => Worker>(
  'Life worker factory',
  {
    providedIn: 'root',
    factory: () => () =>
      new Worker(
        new URL('assets/game-of-life/life-worker.js', document.baseURI),
      ),
  },
);

@Component({
  selector: 'app-game-of-life',
  standalone: true,
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.css', './game-of-life-library.css'],
  imports: [FormsModule, RouterLink, DecimalPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameOfLifeComponent implements AfterViewInit, OnDestroy {
  @ViewChild('board', { static: true }) board!: ElementRef<HTMLCanvasElement>;
  @ViewChild('viewport', { static: true }) viewport!: ElementRef<HTMLElement>;
  private readonly factory = inject(LIFE_WORKER_FACTORY);
  private readonly zone = inject(NgZone);
  private readonly change = inject(ChangeDetectorRef);
  private worker?: Worker;
  private observer?: ResizeObserver;
  private timer?: ReturnType<typeof setTimeout>;
  private frame = 0;
  private requestId = 0;
  private loadVersion = 0;
  private destroyed = false;
  private pending = new Map<number, string>();
  private searchCache?: {
    patterns: LifePattern[];
    query: string;
    category: string;
    featured: boolean;
    result: LifePattern[];
  };
  private groupCache?: {
    patterns: LifePattern[];
    result: { category: string; patterns: LifePattern[] }[];
  };
  private chunks = new Map<string, Promise<Record<string, string>>>();
  private initialText = 'x = 0, y = 0, rule = B3/S23\n!';
  private initialCentered = true;
  private candidateInitial?: { text: string; centered: boolean };
  private validTitle = 'Cañón de planeadores de Gosper';
  private validSelectedId = 'gosperglidergun';
  private initialGeneration = 0;
  private initialEdits = new Map<string, [number, number, boolean]>();
  private initialFit = false;
  private editing = new Map<string, [number, number, boolean]>();
  private pointers = new Map<number, { x: number; y: number }>();
  private lastCell?: [number, number];
  private strokePan = false;
  private spaceHeld = false;
  patterns: LifePattern[] = [];
  readonly categories = LIFE_CATEGORIES;
  selectedId = 'gosperglidergun';
  activeTitle = 'Cañón de planeadores de Gosper';
  category = '';
  query = '';
  featuredOnly = true;
  loading = true;
  busy = false;
  running = false;
  error = '';
  notice = '';
  generation = 0;
  population = 0;
  elapsed = 0;
  rate = 15;
  exponent = 0;
  grid = true;
  trails = false;
  tool: 'draw' | 'erase' | 'pan' = 'pan';
  importText = '';
  randomWidth = 80;
  randomHeight = 50;
  density = 24;
  viewColumns = 100;
  viewRows = 60;
  targetX = 0;
  targetY = 0;
  cursor = '0, 0';
  bounds: LifeBounds = { left: 0, right: 0, top: 0, bottom: 0 };
  view: LifeView = { x: 0, y: 0, scale: 12, width: 800, height: 520, ratio: 1 };

  readonly maxSafePopulation = Number.MAX_SAFE_INTEGER;
  get selectedPattern(): LifePattern | undefined {
    return this.patterns.find((pattern) => pattern.id === this.selectedId);
  }
  get featuredCount(): number {
    return this.patterns.filter((pattern) => pattern.featured).length;
  }
  get filteredPatterns(): LifePattern[] {
    const cached = this.searchCache;
    if (
      cached &&
      cached.patterns === this.patterns &&
      cached.query === this.query &&
      cached.category === this.category &&
      cached.featured === this.featuredOnly
    )
      return cached.result;
    const query = normalizedLifeSearch(this.query);
    const result = this.patterns.filter(
      (pattern) =>
        (!this.featuredOnly || pattern.featured) &&
        (!this.category || this.category === pattern.category) &&
        (!query ||
          normalizedLifeSearch(
            `${pattern.title} ${pattern.id} ${pattern.description} ${pattern.author}`,
          ).includes(query)),
    );
    this.searchCache = {
      patterns: this.patterns,
      query: this.query,
      category: this.category,
      featured: this.featuredOnly,
      result,
    };
    return result;
  }
  get patternGroups(): { category: string; patterns: LifePattern[] }[] {
    const filtered = this.filteredPatterns;
    if (this.groupCache?.patterns === filtered) return this.groupCache.result;
    const result = this.categories
      .map((category) => ({
        category,
        patterns: filtered.filter((pattern) => pattern.category === category),
      }))
      .filter((group) => group.patterns.length);
    this.groupCache = { patterns: filtered, result };
    return result;
  }
  get occupiedWidth(): number {
    return this.population ? this.bounds.right - this.bounds.left + 1 : 0;
  }
  get occupiedHeight(): number {
    return this.population ? this.bounds.bottom - this.bounds.top + 1 : 0;
  }
  get generationsPerTick(): number {
    return 2 ** this.exponent;
  }
  get zoomLabel(): string {
    return this.view.scale >= 1
      ? `${this.view.scale.toFixed(1)} px/celda`
      : `${Math.round(1 / this.view.scale).toLocaleString('es')} celdas/px`;
  }

  ngAfterViewInit(): void {
    this.createWorker();
    this.observer = new ResizeObserver(() => this.resizeCanvas());
    this.observer.observe(this.viewport.nativeElement);
    this.resizeCanvas();
    void this.loadCatalog();
  }
  ngOnDestroy(): void {
    this.destroyed = true;
    this.pauseGame();
    this.observer?.disconnect();
    this.worker?.terminate();
    cancelAnimationFrame(this.frame);
    this.loadVersion++;
  }
  private asset(path: string): string {
    return new URL('assets/game-of-life/' + path, document.baseURI).href;
  }
  private createWorker(): void {
    if (typeof OffscreenCanvas === 'undefined') {
      this.error =
        'Actualiza el navegador para utilizar el lienzo de simulación en segundo plano.';
      this.loading = false;
      return;
    }
    try {
      const worker = this.factory();
      this.worker = worker;
      this.zone.runOutsideAngular(() => {
        worker.onmessage = (event) => {
          if (this.worker !== worker || this.destroyed) {
            (event.data as LifeMessage).bitmap?.close();
            return;
          }
          this.zone.run(() => this.receive(event.data as LifeMessage));
        };
        worker.onerror = () =>
          this.zone.run(() => {
            this.pauseGame();
            this.busy = false;
            this.loading = false;
            this.pending.clear();
            this.worker?.terminate();
            this.worker = undefined;
            this.error =
              'No se ha podido iniciar el motor. Pulsa «Volver al inicio» para intentarlo de nuevo.';
            this.change.markForCheck();
          });
      });
      this.send('init');
    } catch {
      this.error =
        'Tu navegador no permite ejecutar la simulación en segundo plano.';
      this.loading = false;
    }
  }
  private send(type: string, payload: Record<string, unknown> = {}): void {
    if (!this.worker || this.destroyed) return;
    const id = ++this.requestId;
    if (type !== 'view' && type !== 'init') {
      this.pending.set(id, type);
      this.zone.run(() => {
        this.busy = true;
        this.change.markForCheck();
      });
    }
    this.worker.postMessage({
      type,
      id,
      view: this.view,
      options: { grid: this.grid, trails: this.trails },
      ...payload,
    });
  }
  private receive(message: LifeMessage): void {
    const command = this.pending.get(message.id);
    this.pending.delete(message.id);
    this.busy = this.pending.size > 0;
    if (message.type === 'error') {
      this.pauseGame();
      this.loading = false;
      this.error = message.message || 'No se ha podido completar la operación.';
      this.initialFit = false;
      if (command === 'load') {
        this.candidateInitial = undefined;
        this.activeTitle = this.validTitle;
        this.selectedId = this.validSelectedId;
      }
    } else if (message.type === 'export') {
      this.download(message.text || '', message.format || 'rle');
    } else {
      this.generation = message.generation ?? this.generation;
      this.population = message.population ?? this.population;
      this.bounds = message.bounds ?? this.bounds;
      if (command === 'step') this.elapsed = message.elapsed || 0;
      if (message.bitmap) {
        const canvas = this.board.nativeElement;
        if (
          canvas.width !== message.bitmap.width ||
          canvas.height !== message.bitmap.height
        ) {
          canvas.width = message.bitmap.width;
          canvas.height = message.bitmap.height;
        }
        canvas
          .getContext('2d', { alpha: false })
          ?.drawImage(message.bitmap, 0, 0);
        message.bitmap.close();
      }
      if (command === 'load') {
        this.loading = false;
        this.initialGeneration = this.generation;
        if (this.candidateInitial) {
          this.initialText = this.candidateInitial.text;
          this.initialCentered = this.candidateInitial.centered;
          this.initialEdits.clear();
          this.candidateInitial = undefined;
          this.validTitle = this.activeTitle;
          this.validSelectedId = this.selectedId;
        }
        if (this.initialEdits.size)
          this.send('edit', { cells: [...this.initialEdits.values()] });
      }
      if (this.initialFit && !this.busy && !this.loading) {
        this.initialFit = false;
        this.fitPattern();
      }
      if (this.running && this.population === 0 && command === 'step') {
        this.pauseGame();
        this.notice = 'La población se ha extinguido.';
      }
      if (this.running && !this.busy) this.scheduleTick();
    }
    this.change.markForCheck();
  }
  private async loadCatalog(): Promise<void> {
    try {
      const response = await fetch(this.asset('catalog.json'));
      if (!response.ok) throw Error('No se ha podido cargar el catálogo.');
      const catalog = (await response.json()) as { patterns: LifePattern[] };
      if (this.destroyed) return;
      this.patterns = catalog.patterns;
      await this.selectPattern(this.selectedId);
    } catch (error) {
      this.loading = false;
      this.error =
        error instanceof Error ? error.message : 'Error al cargar el catálogo.';
    }
    if (!this.destroyed) this.change.markForCheck();
  }
  async selectPattern(id: string): Promise<void> {
    this.pauseGame();
    this.error = '';
    this.notice = '';
    this.selectedId = id;
    const pattern = this.selectedPattern;
    if (!pattern) return;
    const version = ++this.loadVersion;
    this.loading = true;
    this.change.markForCheck();
    try {
      let chunk = this.chunks.get(pattern.file);
      if (!chunk) {
        chunk = fetch(this.asset(pattern.file)).then(async (response) => {
          if (!response.ok)
            throw Error('No se ha podido descargar este patrón.');
          return (await response.json()) as Record<string, string>;
        });
        this.chunks.set(pattern.file, chunk);
      }
      const data = await chunk;
      if (version !== this.loadVersion || this.destroyed) return;
      if (!data[id])
        throw Error('El archivo no contiene el patrón seleccionado.');
      this.exponent = pattern.exponent;
      this.activeTitle = pattern.title;
      this.loadText(data[id], true, true);
    } catch (error) {
      this.chunks.delete(pattern.file);
      if (version === this.loadVersion) {
        this.loading = false;
        this.error =
          error instanceof Error
            ? error.message
            : 'No se ha podido cargar el patrón.';
      }
    }
    if (!this.destroyed) this.change.markForCheck();
  }
  private loadText(text: string, centered: boolean, fit: boolean): void {
    this.candidateInitial = { text, centered };
    this.editing.clear();
    this.initialFit = fit;
    this.loading = true;
    if (!this.worker) {
      this.loading = false;
      this.error =
        'El motor no está disponible en este navegador. Pulsa «Volver al inicio» para reintentarlo.';
      return;
    }
    this.send('load', { text, centered });
  }
  startGame(): void {
    if (this.busy || this.loading || !this.population) return;
    this.running = true;
    this.error = '';
    this.notice = '';
    this.scheduleTick();
  }
  pauseGame(): void {
    this.running = false;
    if (this.timer !== undefined) clearTimeout(this.timer);
    this.timer = undefined;
  }
  private scheduleTick(): void {
    if (
      !this.running ||
      this.busy ||
      this.timer !== undefined ||
      this.destroyed
    )
      return;
    this.zone.runOutsideAngular(() => {
      this.timer = setTimeout(() => {
        this.timer = undefined;
        if (this.running) this.send('step', { exponent: this.exponent });
      }, 1000 / this.rate);
    });
  }
  nextGeneration(): void {
    if (this.busy || this.loading) return;
    this.pauseGame();
    this.send('step', { exponent: 0 });
  }
  jump(): void {
    if (this.busy || this.loading) return;
    this.pauseGame();
    this.send('step', { exponent: this.exponent });
  }
  changeSpeed(): void {
    if (!Number.isFinite(this.rate)) this.rate = 15;
    this.rate = Math.min(60, Math.max(1, this.rate));
    if (this.running) {
      this.pauseGame();
      this.startGame();
    }
  }
  resetBoard(): void {
    this.pauseGame();
    this.loadVersion++;
    this.loading = false;
    this.error = '';
    this.notice = '';
    this.editing.clear();
    this.candidateInitial = undefined;
    this.initialFit = true;
    this.activeTitle = this.validTitle;
    this.selectedId = this.validSelectedId;
    if (this.busy || !this.worker) {
      this.worker?.terminate();
      this.pending.clear();
      this.busy = false;
      this.createWorker();
      this.loading = true;
      this.send('load', {
        text: this.initialText,
        centered: this.initialCentered,
      });
    } else this.send('restore');
  }
  clearBoard(): void {
    if (this.busy || this.loading) return;
    this.pauseGame();
    this.error = '';
    this.notice = '';
    this.activeTitle = 'Tu universo';
    this.validTitle = this.activeTitle;
    this.selectedId = '';
    this.validSelectedId = '';
    this.initialText = 'x = 0, y = 0, rule = B3/S23\n!';
    this.initialCentered = true;
    this.initialGeneration = 0;
    this.initialEdits.clear();
    this.send('clear');
  }
  fitPattern(): void {
    this.view = {
      ...this.view,
      ...fitLifeView(this.bounds, this.view.width, this.view.height),
    };
    this.updateView();
  }
  zoom(factor: number, pixelX?: number, pixelY?: number): void {
    this.view = zoomLifeView(this.view, factor, pixelX, pixelY);
    this.updateView();
  }
  applyViewSize(): void {
    if (
      ![this.viewColumns, this.viewRows].every(
        (value) => Number.isSafeInteger(value) && value > 0 && value <= 2 ** 50,
      )
    ) {
      this.error =
        'Las dimensiones deben ser enteros positivos de hasta 2⁵⁰ celdas.';
      return;
    }
    this.view.scale = Math.max(
      1e-15,
      Math.min(
        this.view.width / this.viewColumns,
        this.view.height / this.viewRows,
      ),
    );
    this.error = '';
    this.updateView();
  }
  goTo(): void {
    if (
      ![this.targetX, this.targetY].every(
        (value) => Number.isSafeInteger(value) && Math.abs(value) <= 2 ** 50,
      )
    ) {
      this.error = 'Introduce coordenadas enteras entre −2⁵⁰ y 2⁵⁰.';
      return;
    }
    this.view.x = this.targetX + 0.5;
    this.view.y = this.targetY + 0.5;
    this.error = '';
    this.updateView();
  }
  setTargetCell(alive: boolean): void {
    if (this.busy || this.loading) return;
    if (
      ![this.targetX, this.targetY].every(
        (value) => Number.isSafeInteger(value) && Math.abs(value) <= 2 ** 50,
      )
    ) {
      this.error = 'Introduce coordenadas enteras entre −2⁵⁰ y 2⁵⁰.';
      return;
    }
    this.pauseGame();
    this.error = '';
    const cell: [number, number, boolean] = [this.targetX, this.targetY, alive];
    if (this.generation === this.initialGeneration)
      this.initialEdits.set(cell[0] + ',' + cell[1], cell);
    this.send('edit', { cells: [cell] });
  }
  private resizeCanvas(): void {
    const bounds = this.viewport.nativeElement.getBoundingClientRect();
    this.view = {
      ...this.view,
      width: Math.max(1, bounds.width),
      height: Math.max(1, bounds.height),
      ratio: Math.min(2, window.devicePixelRatio || 1),
    };
    this.updateView();
  }
  updateView(): void {
    if (!this.frame)
      this.zone.runOutsideAngular(() => {
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          if (this.editing.size) {
            const cells = [...this.editing.values()];
            this.editing.clear();
            this.send('edit', { cells });
          } else this.send('view');
        });
      });
    this.change.markForCheck();
  }
  wheel(event: WheelEvent): void {
    event.preventDefault();
    const rect = this.board.nativeElement.getBoundingClientRect();
    this.zoom(
      Math.exp(-event.deltaY * 0.0015),
      event.clientX - rect.left,
      event.clientY - rect.top,
    );
  }
  pointerDown(event: PointerEvent): void {
    if (event.button > 1) return;
    event.preventDefault();
    this.board.nativeElement.focus({ preventScroll: true });
    this.board.nativeElement.setPointerCapture(event.pointerId);
    this.pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    this.strokePan =
      this.tool === 'pan' ||
      this.spaceHeld ||
      event.button === 1 ||
      this.pointers.size > 1;
    this.lastCell = undefined;
    if (!this.strokePan && !this.busy && !this.loading) {
      this.pauseGame();
      this.paint(event);
    }
  }
  pointerMove(event: PointerEvent): void {
    const rect = this.board.nativeElement.getBoundingClientRect();
    const cell = this.cellAt(event.clientX, event.clientY, rect);
    this.cursor = `${cell[0].toLocaleString('es')}, ${cell[1].toLocaleString('es')}`;
    const old = this.pointers.get(event.pointerId);
    if (old) {
      if (this.pointers.size === 2) {
        const other = [...this.pointers.entries()].find(
          ([id]) => id !== event.pointerId,
        )![1];
        const oldDistance = Math.hypot(old.x - other.x, old.y - other.y);
        const distance = Math.hypot(
          event.clientX - other.x,
          event.clientY - other.y,
        );
        const midX = (event.clientX + other.x) / 2 - rect.left,
          midY = (event.clientY + other.y) / 2 - rect.top;
        if (oldDistance > 1 && distance > 1)
          this.view = zoomLifeView(
            this.view,
            distance / oldDistance,
            midX,
            midY,
          );
        this.view.x -= (event.clientX - old.x) / (2 * this.view.scale);
        this.view.y -= (event.clientY - old.y) / (2 * this.view.scale);
        this.updateView();
      } else if (this.strokePan) {
        this.view.x -= (event.clientX - old.x) / this.view.scale;
        this.view.y -= (event.clientY - old.y) / this.view.scale;
        this.updateView();
      } else if (!this.loading && !this.running) this.paint(event);
      this.pointers.set(event.pointerId, {
        x: event.clientX,
        y: event.clientY,
      });
    }
  }
  pointerUp(event: PointerEvent): void {
    this.pointers.delete(event.pointerId);
    this.lastCell = undefined;
    if (!this.pointers.size) this.strokePan = false;
  }
  private cellAt(
    clientX: number,
    clientY: number,
    rect: DOMRect,
  ): [number, number] {
    return [
      Math.floor(
        this.view.x +
          (clientX - rect.left - this.view.width / 2) / this.view.scale,
      ),
      Math.floor(
        this.view.y +
          (clientY - rect.top - this.view.height / 2) / this.view.scale,
      ),
    ];
  }
  private paint(event: PointerEvent): void {
    if (this.view.scale < 3) {
      this.notice = 'Acerca el zoom para editar células individuales.';
      return;
    }
    const cell = this.cellAt(
      event.clientX,
      event.clientY,
      this.board.nativeElement.getBoundingClientRect(),
    );
    const from = this.lastCell || cell,
      distance = Math.max(
        Math.abs(cell[0] - from[0]),
        Math.abs(cell[1] - from[1]),
      ),
      steps = Math.min(2000, distance);
    for (let i = 0; i <= steps; i++) {
      const x = Math.round(
          from[0] + (cell[0] - from[0]) * (steps ? i / steps : 0),
        ),
        y = Math.round(from[1] + (cell[1] - from[1]) * (steps ? i / steps : 0));
      if (Math.abs(x) > 2 ** 50 || Math.abs(y) > 2 ** 50) continue;
      const value: [number, number, boolean] = [x, y, this.tool !== 'erase'];
      this.editing.set(`${x},${y}`, value);
      if (this.generation === this.initialGeneration)
        this.initialEdits.set(`${x},${y}`, value);
    }
    this.lastCell = cell;
    this.updateView();
  }
  keyboard(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
      this.spaceHeld = true;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      this.running ? this.pauseGame() : this.startGame();
    } else if (event.key === '.') {
      event.preventDefault();
      this.nextGeneration();
    } else if (event.key === '+' || event.key === '=') this.zoom(1.5);
    else if (event.key === '-') this.zoom(1 / 1.5);
    else if (event.key.toLowerCase() === 'f') this.fitPattern();
    else if (event.key.startsWith('Arrow')) {
      event.preventDefault();
      const distance = 50 / this.view.scale;
      if (event.key === 'ArrowLeft') this.view.x -= distance;
      if (event.key === 'ArrowRight') this.view.x += distance;
      if (event.key === 'ArrowUp') this.view.y -= distance;
      if (event.key === 'ArrowDown') this.view.y += distance;
      this.updateView();
    }
  }
  releaseKey(event: KeyboardEvent): void {
    if (event.key === ' ') this.spaceHeld = false;
  }
  clearPointers(): void {
    this.pointers.clear();
    this.spaceHeld = false;
    this.lastCell = undefined;
  }
  randomize(): void {
    if (this.busy || this.loading) return;
    if (
      ![this.randomWidth, this.randomHeight].every(
        (n) => Number.isSafeInteger(n) && n > 0,
      ) ||
      this.randomWidth * this.randomHeight > 1000000
    ) {
      this.error =
        'La siembra aleatoria admite hasta un millón de casillas. El universo continúa sin bordes.';
      return;
    }
    const density = Math.min(100, Math.max(0, Number(this.density) || 0)) / 100;
    const rows: string[] = [];
    for (let y = 0; y < this.randomHeight; y++) {
      let row = '',
        run = 0,
        alive = false;
      for (let x = 0; x < this.randomWidth; x++) {
        const next = Math.random() < density;
        if (run && next !== alive) {
          row += (run > 1 ? run : '') + (alive ? 'o' : 'b');
          run = 0;
        }
        alive = next;
        run++;
      }
      if (run) row += (run > 1 ? run : '') + (alive ? 'o' : 'b');
      rows.push(row);
    }
    this.pauseGame();
    this.error = '';
    this.selectedId = '';
    this.activeTitle = 'Semilla aleatoria';
    this.exponent = 0;
    this.loadText(
      `x = ${this.randomWidth}, y = ${this.randomHeight}, rule = B3/S23\n${rows.join('$')}!`,
      true,
      true,
    );
  }
  importPattern(): void {
    if (this.busy || this.loading || !this.importText.trim()) return;
    this.pauseGame();
    this.error = '';
    this.selectedId = '';
    this.activeTitle = 'Patrón importado';
    this.exponent = 0;
    this.loadVersion++;
    this.loadText(this.importText, false, true);
  }
  async importFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement,
      file = input.files?.[0];
    if (!file) return;
    if (file.size > 32 * 1024 * 1024) {
      this.error =
        'El archivo supera 32 MB. Utiliza un macrocell comprimido para representar universos grandes.';
      input.value = '';
      return;
    }
    this.importText = await file.text();
    input.value = '';
    if (!this.destroyed) this.importPattern();
  }
  exportPattern(format: 'rle' | 'mc'): void {
    if (this.busy || this.loading) return;
    this.pauseGame();
    this.error = '';
    this.send('export', { format });
  }
  private download(text: string, format: 'rle' | 'mc'): void {
    const url = URL.createObjectURL(
      new Blob([text], { type: 'text/plain;charset=utf-8' }),
    );
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'vida-' + this.generation + '.' + format;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async fullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement === this.viewport.nativeElement)
        await document.exitFullscreen();
      else await this.viewport.nativeElement.requestFullscreen();
    } catch {
      this.notice =
        'La pantalla completa no está disponible en este navegador.';
    }
  }
}
