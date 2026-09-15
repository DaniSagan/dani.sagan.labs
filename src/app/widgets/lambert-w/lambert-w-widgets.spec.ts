import { TestBed } from '@angular/core/testing';
import { LambertWExplorerComponent } from './lambert-w-explorer.component';
import { LambertEquationComponent } from './lambert-equation.component';
describe('Lambert widgets', () => {
  it('renders branches and clears results outside the selected domain', async () => {
    await TestBed.configureTestingModule({ imports: [LambertWExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(LambertWExplorerComponent);
    fixture.detectChanges(); expect(fixture.nativeElement.querySelectorAll('path').length).toBe(2);
    const c = fixture.componentInstance; c.branch = -1; c.example(0); fixture.detectChanges();
    expect(c.value).toBeNull(); expect(fixture.nativeElement.querySelector('.error')).not.toBeNull();
    c.example(c.branchPoint); expect(c.value).toBe(-1); fixture.destroy();
  });
  it('updates the number of solutions at and beyond the maximum', async () => {
    await TestBed.configureTestingModule({ imports: [LambertEquationComponent] }).compileComponents();
    const fixture = TestBed.createComponent(LambertEquationComponent);
    expect(fixture.componentInstance.roots.length).toBe(2);
    fixture.componentInstance.set(1 / Math.E); expect(fixture.componentInstance.roots).toEqual([1]);
    fixture.componentInstance.set(0.45); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('0 soluciones reales'); fixture.destroy();
  });
});
