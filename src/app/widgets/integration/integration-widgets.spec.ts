import { TestBed } from '@angular/core/testing';
import { IntegrationLabComponent } from './integration-lab.component';
import {
  gaussianEstimate,
  halton,
  parameterIntegrand,
  quadrature,
  seededPoints,
} from './integration-math';

describe('Integration numerical methods', () => {
  it('integrates cubics exactly with Simpson and two-node Gauss', () => {
    for (const rule of ['simpson', 'gauss'] as const) {
      expect(quadrature((x) => x ** 3 - 2 * x + 1, -1, 2, 4, rule)).toBeCloseTo(
        3.75,
        12,
      );
    }
    expect(() => quadrature((x) => x, 0, 1, 3, 'simpson')).toThrow();
  });
  it('converges at second order for the composite midpoint and trapezoid rules', () => {
    for (const rule of ['midpoint', 'trapezoid'] as const) {
      const coarse = Math.abs(quadrature((x) => x * x, 0, 1, 4, rule) - 1 / 3);
      const fine = Math.abs(quadrature((x) => x * x, 0, 1, 8, rule) - 1 / 3);
      expect(coarse / fine).toBeCloseTo(4, 10);
    }
  });
  it('handles removable endpoints and parameter zero', () => {
    expect(parameterIntegrand(0, 3)).toBe(3);
    expect(parameterIntegrand(0.5, 0)).toBe(0);
    expect(parameterIntegrand(1e-12, 3)).toBeCloseTo(3, 10);
  });
  it('generates reproducible bounded samples and known Halton coordinates', () => {
    expect(halton(1, 2)).toBe(0.5);
    expect(halton(2, 2)).toBe(0.25);
    expect(halton(3, 3)).toBeCloseTo(1 / 9, 12);
    const points = seededPoints(256, 42);
    expect(points).toEqual(seededPoints(256, 42));
    expect(points).not.toEqual(seededPoints(256, 43));
    expect(
      points.every((p) => p.x >= 0 && p.x < 1 && p.y >= 0 && p.y < 1),
    ).toBeTrue();
  });
  it('improves the Laplace leading term as concentration grows', () => {
    const error = (lambda: number) => {
      const integral = quadrature(
        (t) => Math.exp(-lambda * ((t * t) / 2 + t ** 4 / 4)),
        -2,
        2,
        400,
        'simpson',
      );
      return Math.abs(gaussianEstimate(lambda) / integral - 1);
    };
    expect(error(80)).toBeLessThan(error(8));
    expect(error(80)).toBeLessThan(0.01);
  });
});

describe('Integration labs', () => {
  it('updates the quadrature table through the actual panel slider', () => {
    const fixture = TestBed.createComponent(IntegrationLabComponent);
    fixture.componentRef.setInput('mode', 'quadrature');
    fixture.detectChanges();
    const before = fixture.componentInstance.rows[0].error;
    const slider: HTMLInputElement =
      fixture.nativeElement.querySelector('input[type=range]');
    slider.value = '32';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.panels).toBe(32);
    expect(fixture.componentInstance.rows[0].error).toBeLessThan(before);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(4);
    fixture.destroy();
  });
  it('distinguishes a pole on the contour from a pole inside', () => {
    const fixture = TestBed.createComponent(IntegrationLabComponent);
    fixture.componentRef.setInput('mode', 'residues');
    fixture.detectChanges();
    fixture.componentInstance.radius = 1;
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('no está definida');
    fixture.componentInstance.radius = 0.5;
    fixture.componentInstance.update();
    expect(fixture.componentInstance.result).toBe(0);
    fixture.componentInstance.radius = 1.5;
    fixture.componentInstance.update();
    expect(fixture.componentInstance.result).toBe(Math.PI);
    fixture.destroy();
  });
  it('keeps all six modes finite at their control boundaries', () => {
    for (const mode of [
      'substitution',
      'parameter',
      'laplace',
      'residues',
      'quadrature',
      'sampling',
    ] as const) {
      const fixture = TestBed.createComponent(IntegrationLabComponent);
      fixture.componentRef.setInput('mode', mode);
      fixture.detectChanges();
      for (const high of [false, true]) {
        Object.assign(fixture.componentInstance, {
          parameter: high ? 1.4 : 0,
          lambda: high ? 80 : 1,
          radius: high ? 2.4 : 0.3,
          panels: high ? 64 : 2,
          count: high ? 2048 : 64,
        });
        fixture.componentInstance.update();
        fixture.detectChanges();
        expect(fixture.nativeElement.innerHTML).not.toMatch(/NaN|Infinity/);
      }
      fixture.destroy();
    }
  });
  it('removes the Monte Carlo error claim for deterministic Halton and resets controls', () => {
    const fixture = TestBed.createComponent(IntegrationLabComponent);
    fixture.componentRef.setInput('mode', 'sampling');
    fixture.detectChanges();
    fixture.componentInstance.sampling = 'halton';
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(fixture.componentInstance.note).toContain('determinista');
    expect(fixture.nativeElement.querySelector('button').disabled).toBeTrue();
    fixture.componentInstance.reset();
    expect(fixture.componentInstance.sampling).toBe('random');
    expect(fixture.componentInstance.count).toBe(256);
    fixture.destroy();
  });
});
