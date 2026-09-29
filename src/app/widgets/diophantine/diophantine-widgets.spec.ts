import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DiophantineLabComponent } from './diophantine-lab.component';
import { DiophantineLatticeComponent } from './diophantine-lattice.component';
import { solutionAt, solveDiophantine } from './diophantine.math';
import { DIOPHANTINE_EXERCISES } from '../../articles/number-theory/linear-diophantine/linear-diophantine-exercises';

describe('Diophantine laboratory', () => {
  let fixture: ComponentFixture<DiophantineLabComponent>,
    lab: DiophantineLabComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiophantineLabComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DiophantineLabComponent);
    lab = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('discovers exactly the multiples of the gcd', () => {
    for (let c = -6n; c <= 6n; c++) {
      expect(lab.exists(c)).toBe(c % 3n === 0n);
    }
    lab.changeC(1n);
    fixture.detectChanges();
    expect(lab.result.kind).toBe('none');
    expect(
      fixture.nativeElement.querySelectorAll('.integer-solution').length,
    ).toBe(0);
    lab.changeC(3n);
    expect(lab.result.kind).toBe('line');
  });
  it('hides stale results on invalid input and recovers', () => {
    lab.aText = '1.5';
    lab.update();
    fixture.detectChanges();
    expect(lab.error).not.toBe('');
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    lab.preset('84', '30', '6');
    fixture.detectChanges();
    expect(lab.error).toBe('');
    expect(lab.result.particular).toEqual({ x: -1n, y: 3n });
  });
  it('counts constrained solutions and rejects invalid bounds', () => {
    lab.preset('3', '5', '30');
    lab.mode = 'nonnegative';
    lab.updateConstraints();
    expect(lab.count).toBe(3n);
    expect(lab.sampleRows.length).toBe(3);
    lab.mode = 'positive';
    lab.updateConstraints();
    expect(lab.count).toBe(1n);
    lab.firstAllowed();
    expect(lab.selected).toEqual({ x: 5n, y: 3n });
    lab.preset('84', '30', '6');
    expect(lab.count).toBe(0n);
    lab.mode = 'box';
    lab.xMin = '-6';
    lab.xMax = '9';
    lab.yMin = '-25';
    lab.yMax = '17';
    lab.updateConstraints();
    expect(lab.count).toBe(4n);
    lab.xMin = '10';
    lab.updateConstraints();
    fixture.detectChanges();
    expect(lab.constraintError).not.toBe('');
    expect(
      fixture.nativeElement.querySelector('app-diophantine-lattice'),
    ).toBeNull();
    lab.xMin = '';
    lab.updateConstraints();
    expect(lab.constraintError).toBe('');
  });
  it('handles both-zero coefficients and independent finite bounds', () => {
    lab.preset('0', '0', '0');
    expect(lab.count).toBeNull();
    expect(lab.selected).toBeNull();
    lab.mode = 'box';
    lab.xMin = '0';
    lab.xMax = '2';
    lab.yMin = '-1';
    lab.yMax = '1';
    lab.updateConstraints();
    expect(lab.count).toBe(9n);
    lab.changeC(1n);
    expect(lab.count).toBe(0n);
    expect(lab.exists(0n)).toBeTrue();
    expect(lab.exists(1n)).toBeFalse();
  });
  it('moves the parameter exactly and hides invalid parameter selections', () => {
    lab.setT(100000000000000000000n);
    lab.slider = 2;
    lab.slide();
    expect(lab.t).toBe(100000000000000000002n);
    expect(lab.selected).toEqual(solutionAt(lab.result, lab.t));
    lab.moveT(-1);
    expect(lab.slider).toBe(0);
    expect(lab.sliderCenter).toBe(lab.t);
    lab.tText = '2.5';
    lab.readT();
    fixture.detectChanges();
    expect(lab.parameterError).not.toBe('');
    expect(lab.selected).toBeNull();
    expect(lab.sampleRows).toEqual([]);
    lab.tText = '-2';
    lab.readT();
    expect(lab.parameterError).toBe('');
    expect(lab.t).toBe(-2n);
  });
  it('reveals divisions, back substitution, signed Bezout and scaling', () => {
    lab.preset('84', '30', '18');
    expect(lab.trace.join(' ')).toContain('84 = 30 · 2 + 24');
    expect(lab.trace.join(' ')).toContain('Sustituimos R');
    expect(lab.trace.join(' ')).toContain('(84)·(-1) + (30)·(3) = 6');
    expect(lab.trace.join(' ')).toContain('c/d = 3: x₀ = -3, y₀ = 9');
    lab.moveTrace(999);
    expect(lab.traceStep).toBe(lab.trace.length - 1);
    lab.moveTrace(-999);
    expect(lab.traceStep).toBe(0);
    lab.preset('0', '-5', '10');
    expect(lab.trace.join(' ')).toContain('y₀ = -2');
  });
  it('offers four progressive hints before each reasoned solution', () => {
    expect(DIOPHANTINE_EXERCISES.length).toBe(16);
    for (const exercise of DIOPHANTINE_EXERCISES) {
      expect(exercise.hints.length).toBe(4);
      expect(exercise.solution.length).toBeGreaterThan(50);
    }
  });
});

describe('Diophantine lattice', () => {
  let lattice: DiophantineLatticeComponent;
  beforeEach(() => {
    lattice = new DiophantineLatticeComponent();
    lattice.constraints = {
      x: { min: null, max: null },
      y: { min: null, max: null },
    };
  });
  it('classifies points exactly and clips horizontal and vertical lines', () => {
    for (const [a, b, c] of [
      [0n, 5n, 10n],
      [4n, 0n, 12n],
      [6n, 9n, 3n],
    ]) {
      lattice.result = solveDiophantine(a, b, c);
      lattice.refresh();
      expect(lattice.segment).not.toBeNull();
      expect(lattice.visibleSolutions).toBeGreaterThan(0);
      for (const p of lattice.points) {
        expect(p.solution).toBe(a * p.x + b * p.y === c);
      }
    }
  });
  it('distinguishes an empty integer intersection from the real line', () => {
    lattice.result = solveDiophantine(4n, 6n, 5n);
    lattice.refresh();
    expect(lattice.segment).not.toBeNull();
    expect(lattice.visibleSolutions).toBe(0);
    lattice.result = solveDiophantine(0n, 0n, 0n);
    lattice.refresh();
    expect(lattice.segment).toBeNull();
    expect(lattice.visibleSolutions).toBe(625);
    lattice.result = solveDiophantine(0n, 0n, 1n);
    lattice.refresh();
    expect(lattice.segment).toBeNull();
    expect(lattice.visibleSolutions).toBe(0);
  });
  it('keeps exact coordinates when following a point beyond safe Number precision', () => {
    lattice.result = solveDiophantine(6n, 9n, 3n);
    lattice.selected = solutionAt(lattice.result, 100000000000000000000n);
    lattice.follow = true;
    lattice.refresh();
    expect(lattice.center).toEqual(lattice.selected);
    expect(lattice.locate(lattice.selected)).toEqual({ x: 260, y: 260 });
    expect(
      lattice.points.find((p) => p.dx === 0 && p.dy === 0)!.solution,
    ).toBeTrue();
    expect(lattice.locate({ x: 0n, y: 0n })).toBeNull();
    expect(lattice.next).toEqual(
      solutionAt(lattice.result, 100000000000000000001n),
    );
  });
});
