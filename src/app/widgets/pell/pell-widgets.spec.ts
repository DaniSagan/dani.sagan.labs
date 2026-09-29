import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PellLabComponent } from './pell-lab.component';
import { PellComparisonComponent } from './pell-comparison.component';
import { norm } from './pell.math';
import { PELL_EXERCISES } from '../../articles/number-theory/pell/pell-exercises';

describe('Pell laboratory', () => {
  let fixture: ComponentFixture<PellLabComponent>, lab: PellLabComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PellLabComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PellLabComponent);
    lab = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('starts with bounded discovery and advances to the exact fundamental', () => {
    expect(lab.search).toEqual([
      { x: 3n, y: 2n },
      { x: 17n, y: 12n },
    ]);
    expect(lab.fundamentalIndex).toBe(1);
    lab.move(1);
    expect(lab.rows[lab.step].norm).toBe(1n);
    lab.move(9999);
    expect(lab.step).toBe(lab.rows.length - 1);
    lab.move(-9999);
    expect(lab.step).toBe(0);
  });
  it('resets discovery for D=13 and keeps period and convergent indices distinct', () => {
    lab.choose(13);
    expect(lab.search).toEqual([]);
    expect(lab.fundamentalIndex).toBe(9);
    lab.step = 9;
    expect(lab.currentState.a).toBe(1n);
    expect(lab.visibleRows.length).toBe(8);
    expect(lab.rows[9].p).toBe(649n);
    expect(lab.negative).toEqual({ x: 18n, y: 5n });
    lab.choose(3);
    expect(lab.negative).toBeNull();
    expect(lab.step).toBe(0);
  });
  it('shows square and validation explanations without stale solver output', () => {
    for (const invalid of ['0', '-2', '2.5', '10001', '']) {
      lab.dText = invalid;
      lab.update();
      fixture.detectChanges();
      expect(lab.error).not.toBe('');
      expect(fixture.nativeElement.querySelector('.hyperbola')).toBeNull();
    }
    lab.choose(9);
    fixture.detectChanges();
    expect(lab.error).toBe('');
    expect(lab.expansion.square).toBeTrue();
    expect(fixture.nativeElement.querySelector('.hyperbola')).toBeNull();
    lab.choose(2);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.hyperbola')).not.toBeNull();
  });
  it('verifies all generated values and plots huge points without overflow', () => {
    lab.choose(61);
    lab.count = 20;
    lab.generate();
    lab.select(19);
    lab.fit();
    expect(lab.point.x.toString().length).toBeGreaterThan(100);
    expect(lab.scale > lab.point.x).toBeTrue();
    expect(lab.lattice.length).toBe(0);
    expect(lab.marks.some((p) => p.index === 19)).toBeTrue();
    for (const p of lab.solutions) expect(norm(61n, p)).toBe(1n);
    for (const logarithmic of [false, true]) {
      lab.logarithmic = logarithmic;
      lab.growth();
      expect(lab.growthX).not.toContain('NaN');
      expect(lab.growthY).not.toContain('Infinity');
    }
    lab.count = 2;
    lab.generate();
    expect(lab.selected).toBe(1);
    lab.span = 20;
    lab.zoom();
    expect(lab.lattice.length).toBe(1681);
  });
  it('classifies the small lattice exactly and provides progressive exercises', () => {
    expect(lab.lattice.filter((p) => p.solution).length).toBe(10);
    expect(PELL_EXERCISES.length).toBe(16);
    for (const e of PELL_EXERCISES) {
      expect(e.hints.length).toBe(4);
      expect(e.solution.length).toBeGreaterThan(50);
    }
  });
});
describe('Pell comparison', () => {
  it('excludes squares, sorts exact coordinates and emits selections', () => {
    const comparison = new PellComparisonComponent();
    comparison.limit = 200;
    comparison.update();
    expect(comparison.rows.some((r) => r.D === 4 || r.D === 9)).toBeFalse();
    comparison.order = 'x';
    comparison.sort();
    expect(
      comparison.rows.every((r, i, rows) => i === 0 || rows[i - 1].x <= r.x),
    ).toBeTrue();
    comparison.order = 'period';
    comparison.sort();
    expect(
      comparison.rows.every(
        (r, i, rows) => i === 0 || rows[i - 1].period <= r.period,
      ),
    ).toBeTrue();
    expect(comparison.rows.find((r) => r.D === 13)!.negative).toBeTrue();
    let chosen = 0;
    comparison.choose.subscribe((D) => (chosen = D));
    comparison.choose.emit(13);
    expect(chosen).toBe(13);
  });
});
