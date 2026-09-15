import { TestBed } from '@angular/core/testing';
import { kleinPoint, kleinPoint4D, kleinTraveler, KleinPoint } from './klein-bottle.math';
import { KleinGluingComponent } from './klein-gluing.component';
import { KleinBottleViewerComponent } from './klein-bottle-viewer.component';

const distance = (a: KleinPoint, b: KleinPoint) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

describe('Klein bottle', () => {
  it('closes the transverse curves and identifies longitudinal endpoints in reverse', () => {
    for (let i = 0; i <= 40; i++) {
      const t = i / 40;
      expect(distance(kleinPoint(t, 0), kleinPoint(t, 1))).toBeLessThan(1e-12);
      const partner = ((0.5 - t) % 1 + 1) % 1;
      expect(distance(kleinPoint(0, partner), kleinPoint(1, t))).toBeLessThan(1e-12);
    }
  });
  it('keeps the two branches of the immersion continuous at the neck join', () => {
    for (let i = 0; i <= 20; i++) {
      expect(distance(kleinPoint(0.5 - 1e-7, i / 20), kleinPoint(0.5 + 1e-7, i / 20))).toBeLessThan(1e-5);
    }
  });
  it('flips height and orientation at each Klein seam but not at a torus seam', () => {
    expect(kleinTraveler(1, 0.25, true)).toEqual({ u: 0, v: 0.75, flipped: true, crossings: 1 });
    expect(kleinTraveler(2, 0.25, true)).toEqual({ u: 0, v: 0.25, flipped: false, crossings: 2 });
    expect(kleinTraveler(1, 0.5, true).flipped).toBe(true);
    expect(kleinTraveler(1, 0.25, false).v).toBe(0.25);
  });
  it('respects the Klein identifications in the four-dimensional embedding', () => {
    for (let i = 0; i <= 20; i++) {
      const v = i * Math.PI / 10;
      const a = kleinPoint4D(2 * Math.PI, v), b = kleinPoint4D(0, -v);
      a.forEach((value, j) => expect(value).toBeCloseTo(b[j], 12));
    }
    expect(kleinPoint4D(0, Math.PI / 2)).not.toEqual(kleinPoint4D(0, -Math.PI / 2));
  });
  it('updates the traveler through the seam using the preset button', async () => {
    await TestBed.configureTestingModule({ imports: [KleinGluingComponent] }).compileComponents();
    const fixture = TestBed.createComponent(KleinGluingComponent); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    element.querySelectorAll<HTMLButtonElement>('button')[1].click(); fixture.detectChanges();
    expect(fixture.componentInstance.traveler.v).toBe(0.75);
    expect(element.querySelector('.readout')!.textContent).toContain('invertida');
    fixture.componentInstance.twisted = false; fixture.detectChanges();
    expect(fixture.componentInstance.traveler.v).toBe(0.25);
    fixture.destroy();
  });
  it('initializes, updates and releases the 3D viewer or shows its fallback', async () => {
    await TestBed.configureTestingModule({ imports: [KleinBottleViewerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(KleinBottleViewerComponent); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(!!element.querySelector('canvas') || !!element.querySelector('[role="status"]')).toBe(true);
    fixture.componentInstance.section = 0.5; fixture.componentInstance.wireframe = true; fixture.componentInstance.update();
    expect(Number.isFinite(fixture.componentInstance.position.z)).toBe(true);
    fixture.destroy(); expect(element.querySelector('canvas')).toBeNull();
  });
});
