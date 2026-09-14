import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AliquotExplorerComponent } from './aliquot-explorer.component';

describe('AliquotExplorerComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [AliquotExplorerComponent] }).compileComponents();
  });
  it('renders progressively, inspects transitions and handles zero and invalid inputs', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance; fixture.detectChanges();
    expect(c.result!.values).toEqual([12n]);
    tick(180); expect(c.result!.values).toEqual([12n, 16n]);
    c.select(0); expect(c.divisors).toEqual([1n, 2n, 3n, 4n, 6n]);
    c.logarithmic = true; c.plot(); expect(c.path).not.toContain('NaN');
    c.example(25); tick(360); expect(c.period).toBe(1);
    c.select(1); expect(c.divisors).toEqual([1n, 2n, 3n]);
    c.example(1); tick(180); c.select(1); fixture.detectChanges();
    expect(c.divisors).toEqual([]); expect(c.message).toContain('llega a 0');
    c.input = null; c.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    expect(c.error).not.toBe(''); fixture.destroy();
  }));
  it('continues beyond the former limits with exact values', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance;
    c.steps = 2; c.example(99792000); tick(360);
    expect(c.result!.values.length).toBe(3);
    expect(c.result!.values[1] > 100000000n).toBeTrue();
    expect(c.result!.status).toBe('steps');
    c.example(2 ** 52); tick(180);
    expect(c.result!.values).toEqual([2n ** 52n, 2n ** 52n - 1n]);
    c.steps = 1; c.input = (2n ** 80n).toString(); c.calculate(); tick(180);
    expect(c.result!.status).toBe('steps');
    expect(c.result!.values).toEqual([2n ** 80n, 2n ** 80n - 1n]);
    fixture.detectChanges();
    expect(c.path).not.toContain('NaN');
    c.input = Number.MAX_SAFE_INTEGER + 1; c.calculate();
    expect(c.error).not.toBe('');
    fixture.destroy();
  }));
  it('plots values beyond floating point range and cancels pending factorization', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance;
    c.input = (10n ** 400n + 7n).toString(); c.calculate();
    tick(180, { processNewMacroTasksSynchronously: false });
    expect(c.running).toBeTrue();
    c.stop(); tick(1000);
    expect(c.result!.values.length).toBe(1);
    c.plot(); expect(c.path).not.toMatch(/NaN|Infinity/);
    c.logarithmic = true; c.plot(); expect(c.path).not.toMatch(/NaN|Infinity/);
    expect(c.tickLabel(1)).not.toMatch(/NaN|Infinity/);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(c.input);
    fixture.destroy();
  }));
  it('supports unlimited steps, cancellation, restart and destruction', fakeAsync(() => {
    const fixture = TestBed.createComponent(AliquotExplorerComponent);
    const c = fixture.componentInstance;
    c.steps = 1; c.calculate(); tick(180); expect(c.result!.status).toBe('steps');
    c.unlimited = true; c.steps = null; c.calculate(); tick(360);
    expect(c.result!.values).toEqual([12n, 16n, 15n]); expect(c.running).toBeTrue();
    c.stop(); tick(1000); expect(c.result!.values.length).toBe(3);
    c.example(6); tick(180); expect(c.result!.status).toBe('cycle');
    c.unlimited = false; c.steps = 500; c.example(12); expect(c.running).toBeTrue();
    fixture.destroy(); tick(1000); expect(c.result!.values).toEqual([12n]);
  }));
});
