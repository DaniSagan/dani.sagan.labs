import { TestBed } from '@angular/core/testing';
import { imaginaryExponentialSums } from './euler-series.math';
import { EulerSeriesComponent } from './euler-series.component';

describe('Imaginary exponential series', () => {
  it('generates the first complex terms with the correct signs and factorials', () => {
    const sums = imaginaryExponentialSums(2, 4);
    expect(sums[1].imaginary).toBe(2);
    expect(sums[2].real).toBe(-1);
    expect(sums[3].termImaginary).toBeCloseTo(-8 / 6, 14);
    expect(sums[4].termReal).toBeCloseTo(16 / 24, 14);
  });
  it('approximates the unit circle throughout the supported angles', () => {
    for (let i = -100; i <= 100; i++) {
      const angle = i / 100 * Math.PI;
      const last = imaginaryExponentialSums(angle, 24)[24];
      expect(last.real).toBeCloseTo(Math.cos(angle), 11);
      expect(last.imaginary).toBeCloseTo(Math.sin(angle), 11);
    }
  });
  it('handles zero angle, zero order and invalid inputs', () => {
    expect(imaginaryExponentialSums(0, 24).every(s => s.real === 1 && s.imaginary === 0)).toBe(true);
    expect(imaginaryExponentialSums(Math.PI, 0).length).toBe(1);
    expect(() => imaginaryExponentialSums(Infinity, 3)).toThrowError(RangeError);
    expect(() => imaginaryExponentialSums(0, 25)).toThrowError(RangeError);
    expect(() => imaginaryExponentialSums(0, 1.5)).toThrowError(RangeError);
  });
  it('renders the exact destination and a finite zoomed path', async () => {
    await TestBed.configureTestingModule({ imports: [EulerSeriesComponent] }).compileComponents();
    const fixture = TestBed.createComponent(EulerSeriesComponent);
    const widget = fixture.componentInstance;
    widget.order = 24; widget.zoom = true; fixture.detectChanges();
    expect(widget.target).toEqual({ real: -1, imaginary: 0 });
    expect(widget.error).toBeLessThan(1e-11);
    expect(widget.path).not.toMatch(/NaN|Infinity/);
    expect((fixture.nativeElement as HTMLElement).querySelectorAll('tbody tr').length).toBe(25);
    widget.turns = -0.5; fixture.detectChanges();
    expect(widget.target).toEqual({ real: 0, imaginary: -1 });
    fixture.destroy();
  });
});
