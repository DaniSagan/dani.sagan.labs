import { TestBed } from '@angular/core/testing';
import { Complex, crossRatio, imageCircle, MOBIUS_PRESETS, mobius, pole } from './mobius.math';
import { MobiusExplorerComponent } from './mobius-explorer.component';

describe('Möbius transformations', () => {
  it('maps poles and infinity on the extended plane', () => {
    for (const map of MOBIUS_PRESETS) {
      expect(mobius(map, pole(map))).toBeNull();
    }
    expect(mobius(MOBIUS_PRESETS[0], null)).toEqual(new Complex(0, 0));
    expect(mobius(MOBIUS_PRESETS[2], new Complex(0, 1))).toEqual(new Complex(0, 0));
  });
  it('inverts every preset for finite sample points and rejects a zero determinant', () => {
    for (const map of MOBIUS_PRESETS) {
      const inverse = { a: map.d, b: Complex.multiply(-1, map.b), c: Complex.multiply(-1, map.c), d: map.a };
      for (const p of [new Complex(1, 2), new Complex(-0.3, 0.4), new Complex(0, 0)]) {
        const recovered = mobius(inverse, mobius(map, p))!;
        expect(recovered.real).toBeCloseTo(p.real, 12);
        expect(recovered.imaginary).toBeCloseTo(p.imaginary, 12);
      }
    }
    const one = new Complex(1, 0);
    expect(() => mobius({ a: one, b: one, c: one, d: one }, one)).toThrowError(RangeError);
  });
  it('transforms a circle through zero into the line Re(w)=1/2', () => {
    const shape = imageCircle(MOBIUS_PRESETS[0], new Complex(1, 0), 1);
    expect(shape.kind).toBe('line');
    expect(-shape.C / (2 * shape.L.real)).toBe(0.5);
    expect(shape.L.imaginary).toBe(0);
  });
  it('places mapped circle samples on the analytic image equation', () => {
    for (const map of MOBIUS_PRESETS) {
      for (const center of [new Complex(1, 0), new Complex(-0.4, 0.7), new Complex(0, 0)]) {
        const radius = 1;
        const shape = imageCircle(map, center, radius);
        for (let i = 0; i < 30; i++) {
          const t = i * 2 * Math.PI / 30;
          const w = mobius(map, new Complex(center.real + Math.cos(t), center.imaginary + Math.sin(t)));
          if (!w) { continue; }
          const residual = shape.A * w.absSquared() + 2 * (shape.L.real * w.real - shape.L.imaginary * w.imaginary) + shape.C;
          expect(residual).toBeCloseTo(0, 8);
        }
      }
    }
  });
  it('preserves cross ratios for all interactive fourth points', () => {
    const widget = new MobiusExplorerComponent();
    for (let index = 0; index < MOBIUS_PRESETS.length; index++) {
      widget.index = index;
      for (let x = -20; x <= 20; x++) {
        widget.fourthX = x / 10;
        expect(widget.imageRatio.real).toBeCloseTo(widget.ratio.real, 11);
        expect(widget.imageRatio.imaginary).toBeCloseTo(widget.ratio.imaginary, 11);
      }
    }
  });
  it('renders a pole as infinity and a line without nonfinite SVG coordinates', async () => {
    await TestBed.configureTestingModule({ imports: [MobiusExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MobiusExplorerComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelector<HTMLButtonElement>('button')!.click(); fixture.detectChanges();
    expect(fixture.componentInstance.target).toBeNull();
    expect(element.querySelector('.readout')!.textContent).toContain('∞');
    const path = element.querySelector('path')!;
    expect(path.getAttribute('d')).not.toMatch(/NaN|Infinity/);
    fixture.destroy();
  });
});
