import { TestBed } from '@angular/core/testing';
import { seamPartner, stripNormal, stripPoint, StripPoint } from './mobius-strip.math';
import { MobiusGluingComponent } from './mobius-gluing.component';
import { MobiusStripViewerComponent } from './mobius-strip-viewer.component';

function distance(a: StripPoint, b: StripPoint) { return Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z); }

describe('Möbius strip geometry', () => {
  it('joins the transverse segment in reverse only for the twisted strip', () => {
    for (const twisted of [true, false]) {
      for (const v of [-0.9, -0.3, 0, 0.3, 0.9]) {
        expect(distance(stripPoint(2 * Math.PI, v, twisted), stripPoint(0, seamPartner(v, twisted), twisted))).toBeLessThan(1e-12);
      }
    }
  });
  it('closes the centerline after one lap but flips its normal', () => {
    expect(distance(stripPoint(0, 0), stripPoint(2 * Math.PI, 0))).toBeLessThan(1e-12);
    expect(distance(stripNormal(0), stripNormal(2 * Math.PI))).toBeCloseTo(2, 12);
    expect(distance(stripNormal(0), stripNormal(4 * Math.PI))).toBeLessThan(1e-12);
    expect(distance(stripNormal(0, false), stripNormal(2 * Math.PI, false))).toBeLessThan(1e-12);
  });
  it('traces one boundary over two laps and the untwisted boundaries over one', () => {
    expect(distance(stripPoint(0, 0.6), stripPoint(2 * Math.PI, 0.6))).toBeCloseTo(1.2, 12);
    expect(distance(stripPoint(0, 0.6), stripPoint(4 * Math.PI, 0.6))).toBeLessThan(1e-12);
    for (const v of [-0.6, 0.6]) {
      expect(distance(stripPoint(0, v, false), stripPoint(2 * Math.PI, v, false))).toBeLessThan(1e-12);
    }
  });
  it('uses a unit normal perpendicular to both surface tangent directions', () => {
    for (const twisted of [true, false]) {
      for (let u = 0; u < 4 * Math.PI; u += 0.2) {
        const n = stripNormal(u, twisted);
        const left = stripPoint(u - 1e-5, 0, twisted), right = stripPoint(u + 1e-5, 0, twisted);
        const low = stripPoint(u, -1e-5, twisted), high = stripPoint(u, 1e-5, twisted);
        expect(Math.hypot(n.x, n.y, n.z)).toBeCloseTo(1, 12);
        expect(n.x * (right.x - left.x) + n.y * (right.y - left.y) + n.z * (right.z - left.z)).toBeCloseTo(0, 10);
        expect(n.x * (high.x - low.x) + n.y * (high.y - low.y) + n.z * (high.z - low.z)).toBeCloseTo(0, 10);
      }
    }
  });
  it('renders the reversed seam and updates to the untwisted identification', async () => {
    await TestBed.configureTestingModule({ imports: [MobiusGluingComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MobiusGluingComponent);
    fixture.detectChanges(); expect(fixture.componentInstance.partner).toBe(-0.6);
    fixture.componentInstance.twisted = false; fixture.detectChanges();
    expect(fixture.componentInstance.partner).toBe(0.6);
    expect((fixture.nativeElement as HTMLElement).querySelector('.readout')!.textContent).toContain('dos componentes');
    fixture.destroy();
  });
  it('initializes and releases the 3D canvas or provides the accessible fallback', async () => {
    await TestBed.configureTestingModule({ imports: [MobiusStripViewerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MobiusStripViewerComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(!!element.querySelector('canvas') || !!element.querySelector('[role="status"]')).toBe(true);
    fixture.componentInstance.twisted = false; fixture.componentInstance.rebuild();
    fixture.componentInstance.route = 'edge'; fixture.componentInstance.laps = 2; fixture.componentInstance.move();
    fixture.destroy();
    expect(element.querySelector('canvas')).toBeNull();
  });
});
