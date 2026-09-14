import { TestBed } from '@angular/core/testing';
import { evaluateTaylor, geometricSums, taylorCoefficients, TaylorFunction, functionValue } from './taylor.math';
import { TaylorExplorerComponent } from './taylor-explorer.component';
import { TaylorConvergenceComponent } from './taylor-convergence.component';

describe('Taylor series', () => {
  it('reproduces the Maclaurin coefficients of sine and the exponential', () => {
    const sine = taylorCoefficients('sin', 0, 5);
    expect(sine[0]).toBe(0); expect(sine[1]).toBe(1);
    expect(sine[3]).toBe(-1 / 6); expect(sine[5]).toBe(1 / 120);
    expect(evaluateTaylor(sine, 0.5)).toBeCloseTo(0.5 - 0.5 ** 3 / 6 + 0.5 ** 5 / 120, 14);
    expect(taylorCoefficients('exp', 0, 3)).toEqual([1, 1, 0.5, 1 / 6]);
  });
  it('matches derivatives at shifted centers and approximates nearby values', () => {
    for (const kind of ['sin', 'cos', 'exp'] as TaylorFunction[]) {
      for (const a of [-2, -0.25, 0, 1.5, 2]) {
        const coefficients = taylorCoefficients(kind, a, 12);
        expect(evaluateTaylor(coefficients, 0)).toBe(functionValue(kind, a));
        expect(evaluateTaylor(coefficients, 0.2)).toBeCloseTo(functionValue(kind, a + 0.2), 12);
        const derivative = kind === 'exp' ? Math.exp(a) : kind === 'sin' ? Math.cos(a) : -Math.sin(a);
        expect(coefficients[1]).toBe(derivative);
      }
    }
  });
  it('computes convergent sums, oscillating endpoints and divergent sums', () => {
    expect(geometricSums(-1, 4)).toEqual([1, 0, 1, 0, 1]);
    expect(geometricSums(1, 4)).toEqual([1, 2, 3, 4, 5]);
    expect(geometricSums(0, 3)).toEqual([1, 1, 1, 1]);
    for (const x of [-1.5, -0.5, 0.5, 0.95, 1.5]) {
      const n = 10;
      const sum = geometricSums(x, n)[n];
      expect(1 / (1 - x) - sum).toBeCloseTo(x ** (n + 1) / (1 - x), 10);
    }
  });
  it('rejects invalid orders', () => {
    for (const n of [-1, 1.5, 31, NaN]) {
      expect(() => taylorCoefficients('sin', 0, n)).toThrowError(RangeError);
      expect(() => geometricSums(0.5, n)).toThrowError(RangeError);
    }
  });
  it('renders changed centers, functions and orders without nonfinite coordinates', async () => {
    await TestBed.configureTestingModule({ imports: [TaylorExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TaylorExplorerComponent);
    const widget = fixture.componentInstance;
    widget.kind = 'exp'; widget.center = -2; widget.order = 12; widget.x = 3;
    fixture.detectChanges();
    expect(widget.path(true)).not.toMatch(/NaN|Infinity/);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('path').length).toBe(2);
    widget.x = widget.center; fixture.detectChanges();
    expect(widget.error).toBe(0);
    fixture.destroy();
  });
  it('handles the pole at one without rendering an undefined target line', async () => {
    await TestBed.configureTestingModule({ imports: [TaylorConvergenceComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TaylorConvergenceComponent);
    const widget = fixture.componentInstance;
    widget.x = 1; fixture.detectChanges();
    expect(widget.target).toBeNull(); expect(widget.error).toBeNull();
    expect((fixture.nativeElement as HTMLElement).querySelector('line[stroke-dasharray]')).toBeNull();
    widget.x = -1; fixture.detectChanges();
    expect(widget.status).toContain('alternan'); expect(widget.target).toBe(0.5);
    fixture.destroy();
  });
});
