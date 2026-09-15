import { TestBed } from '@angular/core/testing';
import { BayesExplorerComponent } from './bayes-explorer.component';
describe('BayesExplorerComponent', () => {
  it('updates the frequencies and avoids a misleading chart for impossible evidence', async () => {
    await TestBed.configureTestingModule({ imports: [BayesExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BayesExplorerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('15.38 %');
    expect(fixture.nativeElement.querySelectorAll('.bar').length).toBe(4);
    fixture.componentInstance.preset(0, 90, 0); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stack')).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('No hay alarmas');
    fixture.componentInstance.preset(50, 90, 5); fixture.detectChanges();
    expect(fixture.componentInstance.result.posterior!).toBeCloseTo(0.9 / 0.95, 12);
    fixture.destroy();
  });
});
