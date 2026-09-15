import { TestBed } from '@angular/core/testing';
import { GammaExplorerComponent } from './gamma-explorer.component';
describe('GammaExplorerComponent', () => {
  it('renders branches and replaces results with pole messages', async () => {
    await TestBed.configureTestingModule({ imports: [GammaExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(GammaExplorerComponent);
    const c = fixture.componentInstance; fixture.detectChanges();
    expect(c.paths.length).toBeGreaterThanOrEqual(6);
    expect(fixture.nativeElement.querySelector('.result')).not.toBeNull();
    c.example(0); fixture.detectChanges(); expect(c.value).toBeNull(); expect(c.cursorError).toContain('polo');
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    c.logarithmic = true; c.plot(); expect(c.paths.join('')).not.toContain('NaN');
    expect(c.visible(120)).toBeTrue();
    c.input = null; c.calculate(); expect(c.error).toContain('Introduce'); fixture.destroy();
  });
});
