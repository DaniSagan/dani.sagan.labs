import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { CellularAutomataLabComponent } from './cellular-automata-lab.component';
import { singleSeed } from './cellular-automata.math';

describe('Cellular automata laboratory', () => {
  let fixture: ComponentFixture<CellularAutomataLabComponent>;
  let component: CellularAutomataLabComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CellularAutomataLabComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(CellularAutomataLabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());

  it('renders the complete default Rule 30 and all eight editable outputs', () => {
    expect(component.binary).toBe('00011110');
    expect(component.visible).toBe(121);
    expect(fixture.nativeElement.querySelectorAll('.output').length).toBe(8);
    expect(
      fixture.nativeElement.querySelector('.canvas-scroll canvas').width,
    ).toBe(241);
    fixture.nativeElement.querySelectorAll('.output')[0].click();
    fixture.detectChanges();
    expect(component.rule).toBe(158);
    expect(component.binary).toBe('10011110');
  });
  it('supports every initial state operation and preserves the original in comparisons', () => {
    component.seed('clear');
    expect(component.initial.every((bit) => bit === 0)).toBeTrue();
    component.seed('invert');
    expect(component.initial.every((bit) => bit === 1)).toBeTrue();
    component.seed('single');
    expect(Array.from(component.initial)).toEqual(Array.from(singleSeed(241)));
    component.flipInitial(5);
    expect(component.initial[5]).toBe(1);
    component.seed('random');
    const saved = component.initial.slice();
    component.showThird = true;
    component.setMode('compare');
    expect(Array.from(component.comparison[0])).toEqual(Array.from(saved));
    expect(Array.from(component.third[0])).toEqual(Array.from(saved));
    component.selectRule(110);
    expect(Array.from(component.initial)).toEqual(Array.from(saved));
  });
  it('resets, steps, plays, pauses, and cleans up its timer', fakeAsync(() => {
    component.generations = 4;
    component.speed = 10;
    component.configure();
    component.reset();
    expect(component.visible).toBe(1);
    component.step();
    expect(component.visible).toBe(2);
    component.play();
    tick(100);
    expect(component.visible).toBe(3);
    component.pause();
    tick(1000);
    expect(component.visible).toBe(3);
    component.play();
    tick(200);
    expect(component.visible).toBe(5);
    expect(component.running).toBeFalse();
    component.play();
    expect(component.visible).toBe(1);
    fixture.destroy();
    tick(1000);
    expect(component.running).toBeFalse();
  }));
  it('rejects invalid dimensions without allocating a new simulation', () => {
    const original = component.rows;
    component.width = 1000000;
    component.configure();
    fixture.detectChanges();
    expect(component.error).not.toBe('');
    expect(component.rows).toBe(original);
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    component.width = 31;
    component.configure();
    expect(component.error).toBe('');
    expect(component.column).toBe(15);
    expect(component.initial.length).toBe(31);
  });
  it('inspects neighborhood parents and edits only row zero', () => {
    component.pick({ row: 1, column: 119 });
    expect(component.inspection).toEqual({ input: '001', output: 1 });
    expect(component.inspector?.nativeElement.open).toBeTrue();
    expect(component.highlights.length).toBe(4);
    component.pick({ row: 0, column: 119 });
    expect(component.initial[119]).toBe(1);
    component.reset();
    expect(component.inspection).toBeNull();
    component.inspectionColumn = -1;
    expect(component.highlights).toEqual([]);
  });
  it('extracts only visible rows and keeps perturbations separate from the baseline', () => {
    const original = component.initial.slice();
    component.setMode('difference');
    expect(component.differenceRows[0].reduce((a, b) => a + b, 0)).toBe(1);
    expect(Array.from(component.initial)).toEqual(Array.from(original));
    component.reset();
    expect(component.sequence).toEqual([1]);
    expect(component.blockStats.every((stat) => stat.count === 0)).toBeTrue();
    component.column = -1;
    expect(component.sequence).toEqual([]);
  });
  it('makes every rule reachable in the paginated atlas and opens with a central seed', () => {
    component.setMode('atlas');
    const rules: number[] = [];
    for (let page = 0; page < 8; page++) {
      expect(component.atlas.length).toBe(32);
      rules.push(...component.atlas.map((item) => item.rule));
      component.atlasPage(1);
    }
    expect(rules).toEqual(Array.from({ length: 256 }, (_, i) => i));
    component.featuredOnly = true;
    component.loadAtlas();
    expect(component.atlas.length).toBe(6);
    component.seed('clear');
    component.openAtlas(90);
    expect(component.rule).toBe(90);
    expect(component.mode).toBe('explore');
    expect(Array.from(component.initial)).toEqual(Array.from(singleSeed(241)));
  });
  it('reflects rule and initial together and is reversible', () => {
    component.flipInitial(2);
    const original = component.initial.slice();
    component.reflect();
    expect(component.rule).toBe(86);
    expect(component.initial[238]).toBe(1);
    component.reflect();
    expect(component.rule).toBe(30);
    expect(Array.from(component.initial)).toEqual(Array.from(original));
  });
  it('handles invalid comparison rules without stale diagrams', () => {
    component.setMode('compare');
    component.compareRule = 256;
    component.refreshMode();
    fixture.detectChanges();
    expect(component.validComparison).toBeFalse();
    expect(fixture.nativeElement.querySelector('.comparison')).toBeNull();
  });

  it('maps scaled canvas clicks to cells and ignores unrevealed generations', () => {
    const canvas: HTMLCanvasElement = fixture.nativeElement.querySelector(
      '.canvas-scroll canvas',
    );
    spyOn(canvas, 'getBoundingClientRect').and.returnValue({
      left: 10,
      top: 20,
      width: 482,
      height: 242,
    } as DOMRect);
    canvas.dispatchEvent(
      new MouseEvent('click', { clientX: 10 + 119 * 2 + 1, clientY: 23 }),
    );
    expect(component.inspectionColumn).toBe(119);
    expect(component.inspectionRow).toBe(1);
    expect(component.inspection?.input).toBe('001');
    component.reset();
    fixture.detectChanges();
    canvas.dispatchEvent(new MouseEvent('click', { clientX: 50, clientY: 30 }));
    expect(component.inspectionRow).toBe(1);
    canvas.dispatchEvent(new MouseEvent('click', { clientX: 11, clientY: 21 }));
    expect(component.initial[0]).toBe(1);
  });
});
