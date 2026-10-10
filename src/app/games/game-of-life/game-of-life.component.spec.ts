import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import {
  GameOfLifeComponent,
  LIFE_WORKER_FACTORY,
} from './game-of-life.component';

class LifeWorkerStub {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: (() => void) | null = null;
  commands: {
    type: string;
    id: number;
    exponent?: number;
    cells?: [number, number, boolean][];
  }[] = [];
  terminate = jasmine.createSpy('terminate');
  generation = 0;
  population = 36;
  postMessage(command: {
    type: string;
    id: number;
    exponent?: number;
    cells?: [number, number, boolean][];
  }): void {
    this.commands.push(command);
    if (command.type === 'step')
      this.generation += 2 ** (command.exponent || 0);
    if (
      command.type === 'restore' ||
      command.type === 'load' ||
      command.type === 'clear'
    )
      this.generation = 0;
    if (command.type === 'clear') this.population = 0;
    Promise.resolve().then(() =>
      this.onmessage?.({
        data: {
          type: 'state',
          id: command.id,
          generation: this.generation,
          population: this.population,
          bounds: { left: -18, right: 17, top: -4, bottom: 4 },
        },
      } as MessageEvent),
    );
  }
}

describe('GameOfLifeComponent', () => {
  let component: GameOfLifeComponent;
  let fixture: ComponentFixture<GameOfLifeComponent>;
  let worker: LifeWorkerStub;
  beforeEach(async () => {
    worker = new LifeWorkerStub();
    spyOn(window, 'fetch').and.callFake(
      async (input: RequestInfo | URL) =>
        ({
          ok: true,
          json: async () =>
            String(input).includes('catalog.json')
              ? {
                  patterns: [
                    {
                      id: 'gosperglidergun',
                      title: 'Cañón de Gosper',
                      category: 'Cañones',
                      description: 'Emite planeadores.',
                      author: 'Bill Gosper',
                      width: 36,
                      height: 9,
                      population: 36,
                      featured: true,
                      exponent: 0,
                      source:
                        'https://conwaylife.com/patterns/gosperglidergun.rle',
                      file: 'patterns/000.json',
                    },
                  ],
                }
              : { gosperglidergun: 'x = 2, y = 2, rule = B3/S23\n2o$2o!' },
        }) as Response,
    );
    await TestBed.configureTestingModule({
      imports: [GameOfLifeComponent],
      providers: [
        provideRouter([]),
        {
          provide: LIFE_WORKER_FACTORY,
          useValue: () => worker as unknown as Worker,
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(GameOfLifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });
  afterEach(() => fixture?.destroy());
  it('loads the searchable catalogue and dispatches a pattern to the worker', () => {
    expect(component.patterns.length).toBe(1);
    expect(
      worker.commands.some((command) => command.type === 'load'),
    ).toBeTrue();
    expect(fixture.nativeElement.querySelector('canvas')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('table')).toBeNull();
  });
  it('keeps the single-generation button independent of the configured jump', async () => {
    component.exponent = 20;
    component.nextGeneration();
    await fixture.whenStable();
    expect(
      worker.commands.filter((command) => command.type === 'step').pop()!
        .exponent,
    ).toBe(0);
    component.jump();
    await fixture.whenStable();
    expect(
      worker.commands.filter((command) => command.type === 'step').pop()!
        .exponent,
    ).toBe(20);
  });
  it('allows a trillion-cell viewport and exact editing at distant coordinates without allocating a dense board', async () => {
    component.viewColumns = 1000000000000;
    component.viewRows = 1000000000000;
    component.applyViewSize();
    expect(component.view.scale).toBeLessThan(1e-8);
    component.targetX = 1000000000000;
    component.targetY = -1000000000000;
    component.setTargetCell(true);
    await fixture.whenStable();
    expect(
      worker.commands.filter((command) => command.type === 'edit').pop()!.cells,
    ).toEqual([[1000000000000, -1000000000000, true]]);
  });
  it('terminates the worker and animation on destruction', () => {
    component.startGame();
    component.ngOnDestroy();
    expect(component.running).toBeFalse();
    expect(worker.terminate).toHaveBeenCalled();
  });
  it('keeps playback controls and status stable between worker steps', () => {
    component.running = true;
    const snapshot = (busy: boolean) => {
      component.busy = busy;
      fixture.detectChanges();
      const root: HTMLElement = fixture.nativeElement;
      return {
        buttons: Array.from(
          root.querySelectorAll<HTMLButtonElement>(
            '.play-controls button, .tools button',
          ),
        ).map((button) => ({
          text: button.textContent?.trim(),
          disabled: button.disabled,
        })),
        status: root.querySelector('.canvas-label')?.textContent,
      };
    };
    const idle = snapshot(false);
    expect(snapshot(true)).toEqual(idle);
    expect(idle.status).toContain('En evolución');
    expect(
      idle.buttons.find((button) => button.text === 'Paso +1')?.disabled,
    ).toBeTrue();
    expect(
      idle.buttons.find((button) => button.text === 'Volver al inicio')
        ?.disabled,
    ).toBeFalse();
    component.running = false;
    component.busy = false;
  });
});
