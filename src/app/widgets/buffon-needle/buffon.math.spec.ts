import { TestBed } from '@angular/core/testing';
import { estimatePi, needleCrosses, sampleNeedle } from './buffon.math';
import { BuffonExplorerComponent } from './buffon-explorer.component';

describe('Buffon needle', () => {
  it('handles parallel, perpendicular and touching needles', () => {
    expect(needleCrosses(0.1, 1, 0)).toBe(false);
    expect(needleCrosses(0.5, 1, 1)).toBe(true);
    expect(needleCrosses(0.25, 1, Math.sin(Math.PI / 6))).toBe(true);
    expect(needleCrosses(0.251, 1, 0.5)).toBe(false);
    expect(needleCrosses(0.2, 0.5, -1)).toBe(true);
  });
  it('rejects the zero vector and points outside the unit disk', () => {
    const values = [0.5, 0.5, 0.99, 0.99, 0.5, 0.9, 0.125, 0.5];
    const needle = sampleNeedle(1, () => values.shift()!);
    expect(needle.dx).toBe(0); expect(needle.dy).toBe(1);
    expect(needle.y).toBe(1.5); expect(needle.crosses).toBe(true);
    expect(values.length).toBe(0);
  });
  it('matches crossings computed independently from the endpoints', () => {
    let state = 87654321;
    const random = () => { state = (1664525 * state + 1013904223) >>> 0; return state / 4294967296; };
    let crosses = 0;
    for (let i = 0; i < 20000; i++) {
      const n = sampleNeedle(0.8, random);
      const lower = n.y - 0.4 * Math.abs(n.dy), upper = n.y + 0.4 * Math.abs(n.dy);
      expect(n.crosses).toBe(Math.ceil(lower) <= upper);
      expect(Math.hypot(n.dx, n.dy)).toBeCloseTo(1, 12);
      if (n.crosses) { crosses++; }
    }
    expect(Math.abs(crosses / 20000 - 1.6 / Math.PI)).toBeLessThan(0.015);
  });
  it('does not report an estimate without crossings and rejects unsupported lengths', () => {
    expect(estimatePi(1, 0, 0)).toBeNull(); expect(estimatePi(1, 10, 0)).toBeNull();
    expect(estimatePi(1, 1000, 636)).toBeCloseTo(2000 / 636, 12);
    for (const ratio of [0, -1, 2, NaN]) { expect(() => sampleNeedle(ratio)).toThrowError(RangeError); }
  });
  it('bounds displayed needles, accumulates batches and clears the experiment', () => {
    const widget = new BuffonExplorerComponent();
    widget.launch(1000); widget.launch(100);
    expect(widget.count).toBe(1100); expect(widget.needles.length).toBe(120); expect(widget.history.length).toBe(2);
    widget.reset(); expect(widget.count).toBe(0); expect(widget.crosses).toBe(0); expect(widget.history.length).toBe(0);
    widget.count = widget.limit - 2; widget.launch(1000); expect(widget.count).toBe(widget.limit);
  });
  it('renders the initial state and updates counts after a button click', async () => {
    await TestBed.configureTestingModule({ imports: [BuffonExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BuffonExplorerComponent); fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Lanza la primera tanda');
    element.querySelector<HTMLButtonElement>('button')!.click(); fixture.detectChanges();
    expect(fixture.componentInstance.count).toBe(1);
    expect(element.textContent).not.toMatch(/NaN|Infinity/);
    fixture.destroy();
  });
});
