import { TestBed } from '@angular/core/testing';
import { FourierExplorerComponent } from './fourier-explorer.component';
import { FourierWave, fourierCoefficients, fourierSum, waveValue } from './fourier.math';

describe('Fourier series', () => {
  it('recovers analytic coefficients from numerical projection over one period', () => {
    const samples = 12000;
    for (const wave of ['square', 'saw', 'triangle'] as FourierWave[]) {
      const coefficients = fourierCoefficients(wave, 7);
      coefficients.forEach((coefficient, index) => {
        let projection = 0;
        for (let i = 0; i < samples; i++) {
          const x = -Math.PI + (i + 0.5) * 2 * Math.PI / samples;
          projection += waveValue(wave, x) * Math.sin((index + 1) * x) * 2 / samples;
        }
        expect(coefficient).toBeCloseTo(projection, 6);
      });
    }
  });
  it('preserves odd symmetry, periodicity and the midpoint at jumps', () => {
    for (const wave of ['square', 'saw', 'triangle'] as FourierWave[]) {
      const coefficients = fourierCoefficients(wave, 39);
      expect(fourierSum(coefficients, 0)).toBe(0);
      expect(fourierSum(coefficients, 0.7)).toBeCloseTo(-fourierSum(coefficients, -0.7), 12);
      expect(fourierSum(coefficients, 0.7 + 2 * Math.PI)).toBeCloseTo(fourierSum(coefficients, 0.7), 12);
    }
    expect(waveValue('square', Math.PI)).toBe(0);
    expect(waveValue('saw', -Math.PI)).toBe(0);
    expect(fourierSum(fourierCoefficients('square', 3), 0.5)).toBe(fourierSum(fourierCoefficients('square', 4), 0.5));
  });
  it('reconstructs a continuous triangular wave and the square plateau away from jumps', () => {
    expect(fourierSum(fourierCoefficients('triangle', 99), 0.7)).toBeCloseTo(waveValue('triangle', 0.7), 3);
    expect(fourierSum(fourierCoefficients('square', 99), Math.PI / 2)).toBeCloseTo(1, 1);
  });
  it('finds the Gibbs peak and implements the arithmetic mean of partial sums', () => {
    const coefficients = fourierCoefficients('square', 99);
    const peak = fourierSum(coefficients, Math.PI / 100);
    expect(peak).toBeCloseTo(1.17898, 3);
    const x = 0.2, n = 9;
    const c = fourierCoefficients('square', n);
    let average = 0;
    for (let i = 1; i <= n; i++) { average += fourierSum(c.slice(0, i), x) / (n + 1); }
    expect(fourierSum(c, x, true)).toBeCloseTo(average, 12);
    for (let i = 0; i <= 200; i++) {
      expect(Math.abs(fourierSum(coefficients, -Math.PI + i * Math.PI / 100, true))).toBeLessThanOrEqual(1 + 1e-12);
    }
  });
  it('rejects invalid truncation orders', () => {
    for (const n of [0, 100, NaN, 2.5]) { expect(() => fourierCoefficients('square', n)).toThrowError(RangeError); }
  });
  it('renders the Gibbs comparison and updates paths when the zoom changes', async () => {
    await TestBed.configureTestingModule({ imports: [FourierExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FourierExplorerComponent);
    const widget = fixture.componentInstance;
    widget.gibbs = true; fixture.detectChanges();
    const before = widget.curve;
    widget.halfWidth = 0.1; widget.showFejer = true; widget.update(); fixture.detectChanges();
    expect(widget.curve).not.toBe(before);
    expect(widget.curve).not.toMatch(/NaN|Infinity/);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('path').length).toBe(3);
    expect(widget.targetCurve.split('M').length).toBe(3);
    fixture.destroy();
  });
});
