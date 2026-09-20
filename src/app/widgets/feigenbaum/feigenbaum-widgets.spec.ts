import { TestBed } from '@angular/core/testing';
import { FeigenbaumExplorerComponent } from './feigenbaum-explorer.component';
import { FeigenbaumConvergenceComponent } from './feigenbaum-convergence.component';

describe('Feigenbaum interactive widgets', () => {
  it('updates the orbit and parameter when switching regions and presets', async () => {
    await TestBed.configureTestingModule({ imports: [FeigenbaumExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FeigenbaumExplorerComponent);
    fixture.detectChanges();
    const lab = fixture.componentInstance;
    const previousPath = lab.first;
    lab.changeView(3);
    expect(lab.r).toBeGreaterThanOrEqual(3.82);
    expect(lab.first).not.toBe(previousPath);
    lab.select(3.2);
    expect(lab.zoom).toBe(0);
    expect(lab.lambda).toBeLessThan(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('3.2000000');
    fixture.destroy();
  });
  it('renders computed values and switches the convergence family', async () => {
    await TestBed.configureTestingModule({ imports: [FeigenbaumConvergenceComponent] }).compileComponents();
    const fixture = TestBed.createComponent(FeigenbaumConvergenceComponent);
    fixture.detectChanges();
    const lab = fixture.componentInstance;
    lab.kind = 'sine';
    lab.level = 8;
    fixture.detectChanges();
    expect(lab.prediction).toBeCloseTo(0.865579269, 7);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(9);
    expect(fixture.nativeElement.textContent).toContain('seno');
    fixture.destroy();
  });
});
