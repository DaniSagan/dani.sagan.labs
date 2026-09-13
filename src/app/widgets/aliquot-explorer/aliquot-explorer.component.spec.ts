import { TestBed } from '@angular/core/testing';
import { AliquotExplorerComponent } from './aliquot-explorer.component';

describe('AliquotExplorerComponent', () => {
  it('renders paths, inspects a transition and handles zero and invalid inputs', async () => {
    await TestBed.configureTestingModule({ imports: [AliquotExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance; fixture.detectChanges();
    expect(c.divisors).toEqual([1, 2, 3, 4, 6]);
    c.logarithmic = true; c.plot(); expect(c.path).not.toContain('NaN');
    c.example(25); expect(c.period).toBe(1);
    c.select(1); expect(c.divisors).toEqual([1, 2, 3]);
    c.example(1); c.select(1); fixture.detectChanges();
    expect(c.divisors).toEqual([]); expect(c.message).toContain('llega a 0');
    c.input = null; c.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(c.error).not.toBe(''); fixture.destroy();
  });
});
