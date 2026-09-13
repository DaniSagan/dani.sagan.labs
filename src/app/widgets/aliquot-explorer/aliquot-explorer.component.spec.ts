import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AliquotExplorerComponent } from './aliquot-explorer.component';

describe('AliquotExplorerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AliquotExplorerComponent] }).compileComponents();
  });
  it('renders progressively, inspects transitions and handles zero and invalid inputs', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance; fixture.detectChanges();
    expect(c.result!.values).toEqual([12]);
    tick(180); expect(c.result!.values).toEqual([12, 16]);
    c.select(0); expect(c.divisors).toEqual([1, 2, 3, 4, 6]);
    c.logarithmic = true; c.plot(); expect(c.path).not.toContain('NaN');
    c.example(25); tick(360); expect(c.period).toBe(1);
    c.select(1); expect(c.divisors).toEqual([1, 2, 3]);
    c.example(1); tick(180); c.select(1); fixture.detectChanges();
    expect(c.divisors).toEqual([]); expect(c.message).toContain('llega a 0');
    c.input = null; c.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(c.error).not.toBe(''); fixture.destroy();
  }));
  it('supports unlimited steps, cancellation, restart and destruction', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance;
    c.steps = 1; c.calculate(); tick(180); expect(c.result!.status).toBe('steps');
    c.unlimited = true; c.steps = null; c.calculate(); tick(360);
    expect(c.result!.values).toEqual([12, 16, 15]); expect(c.running).toBeTrue();
    c.stop(); tick(1000); expect(c.result!.values.length).toBe(3);
    c.example(6); tick(180); expect(c.result!.status).toBe('cycle');
    c.unlimited = false; c.steps = 500; c.example(12); expect(c.running).toBeTrue();
    fixture.destroy(); tick(1000); expect(c.result!.values).toEqual([12]);
  }));
});
