import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RamseyExplorerComponent } from './ramsey-explorer.component';
import { RamseyProofComponent } from './ramsey-proof.component';
import { RamseyCensusComponent } from './ramsey-census.component';
import { ramseyEdges } from '../../shared/math/ramsey';

describe('Ramsey interactive widgets', () => {
  it('edits graph edges with keyboard and updates the triangle counters', async () => {
    await TestBed.configureTestingModule({
      imports: [RamseyExplorerComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(RamseyExplorerComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.triangles.length).toBe(0);
    const oldMask = fixture.componentInstance.mask;
    const edge = fixture.nativeElement.querySelector(
      'line[role="button"]',
    ) as SVGElement;
    edge.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.mask).not.toBe(oldMask);
    expect(fixture.componentInstance.triangles.length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelector('line[role="button"]')).toBe(
      edge,
    );
    expect(edge.getAttribute('aria-label')).toContain('Cambiar color');
    fixture.destroy();
  });
  it('has a sharp two-triangle example and all 32 pentagon extensions contain triangles', () => {
    const widget = new RamseyExplorerComponent();
    widget.preset('minimum');
    expect(widget.triangles.length).toBe(2);
    for (let extension = 0; extension < 32; extension++) {
      widget.extension = extension;
      widget.extend();
      expect(widget.n).toBe(6);
      expect(widget.triangles.length).toBeGreaterThanOrEqual(2);
    }
    widget.selected = 0;
    widget.toggle(0);
    expect(widget.selected).toBe(-1);
  });
  it('demonstrates both branches and updates the certificate after an edit', () => {
    const widget = new RamseyProofComponent();
    widget.branch(false);
    expect(widget.witness.matching).toBeDefined();
    widget.branch(true);
    expect(widget.witness.matching).toBeUndefined();
    const inner = ramseyEdges(6).findIndex((e) => e.a === 1 && e.b === 2);
    widget.toggle(inner);
    expect(widget.witness.matching).toBeDefined();
    widget.step = 3;
    expect(widget.highlight.length).toBe(3);
    widget.select(5);
    expect(widget.witness.chosen.includes(5)).toBeFalse();
  });
  it('enumerates both spaces completely and exposes valid examples', fakeAsync(() => {
    const census = new RamseyCensusComponent();
    census.start();
    tick();
    expect(census.processed).toBe(32768);
    expect(census.minimum).toBe(2);
    expect(census.mean).toBe(5);
    expect(census.counts[0]).toBe(0);
    census.select(2);
    expect(census.selectedTriangles.length).toBe(2);
    census.n = 5;
    census.reset();
    census.start();
    tick();
    expect(census.processed).toBe(1024);
    expect(census.counts[0]).toBe(12);
    expect(census.mean).toBe(2.5);
    expect(census.selectedTriangles.length).toBe(0);
    census.ngOnDestroy();
  }));
  it('cancels pending enumeration on pause, reset and destruction', fakeAsync(() => {
    const census = new RamseyCensusComponent();
    census.start();
    census.pause();
    tick();
    expect(census.processed).toBe(0);
    census.start();
    census.reset();
    tick();
    expect(census.processed).toBe(0);
    census.start();
    census.ngOnDestroy();
    tick();
    expect(census.processed).toBe(0);
  }));
});
