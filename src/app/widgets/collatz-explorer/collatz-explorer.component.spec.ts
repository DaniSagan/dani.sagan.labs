import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CollatzRun, collatzNext, parseCollatzStart } from '../../shared/math/collatz';
import { CollatzExplorerComponent } from './collatz-explorer.component';

describe('Collatz explorer', () => {
  it('calculates reference trajectories and statistics with ordinary step counting', () => {
    const six = new CollatzRun(6n, 100);
    while (six.status === 'running') six.advance();
    expect(six.values).toEqual([6n, 3n, 10n, 5n, 16n, 8n, 4n, 2n, 1n]);
    expect(six.maximum).toBe(16n); expect(six.peakStep).toBe(4);
    expect(six.even).toBe(6); expect(six.odd).toBe(2); expect(six.firstDescent).toBe(1);
    const r = new CollatzRun(27n, 1000);
    while (r.status === 'running') r.advance();
    expect(r.steps).toBe(111); expect(r.maximum).toBe(9232n); expect(r.peakStep).toBe(77);
    expect(r.records[r.records.length - 1]).toEqual({ step: 77, value: 9232n });
  });
  it('preserves arbitrary precision, validates input and distinguishes partial results', () => {
    const n = parseCollatzStart('9007199254740993');
    expect(collatzNext(n)).toBe(27021597764222980n);
    const r = new CollatzRun(2n ** 1100n, 1100);
    while (r.status === 'running') r.advance();
    expect(r.status).toBe('one'); expect(r.steps).toBe(1100);
    expect(new CollatzRun(1n, 1).steps).toBe(0);
    const partial = new CollatzRun(27n, 1); partial.advance(); expect(partial.status).toBe('limit');
    ['', '0', '-1', '1.2', '1e20'].forEach(s => expect(() => parseCollatzStart(s)).toThrow());
    [0, 1.5, 100001, NaN].forEach(n => expect(() => new CollatzRun(1n, n)).toThrow());
  });
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CollatzExplorerComponent] }).compileComponents();
  });
  it('supports unlimited runs, cancellation and returning to a finite limit', fakeAsync(() => {
    const fixture = TestBed.createComponent(CollatzExplorerComponent);
    const c = fixture.componentInstance;
    c.unlimited = true; c.limit = null; c.calculate(); fixture.detectChanges(); tick(0); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[name=limit]').disabled).toBeTrue();
    expect(c.run!.limit).toBeNull();
    tick(1000); expect(c.run!.status).toBe('one'); expect(c.run!.steps).toBe(111);
    c.input = (2n ** 2000n).toString(); c.calculate();
    tick(16); c.stop();
    const steps = c.run!.steps; tick(1000);
    expect(c.run!.status).toBe('stopped'); expect(c.run!.steps).toBe(steps);
    c.unlimited = false; c.limit = 1; c.example(27); tick(1000);
    expect(c.run!.status).toBe('limit'); expect(c.run!.steps).toBe(1);
    c.limit = null; c.calculate(); expect(c.error).not.toBe('');
    fixture.destroy();
  }));
  it('records only complete runs, resets history and cancels scheduled work', fakeAsync(() => {
    const fixture = TestBed.createComponent(CollatzExplorerComponent);
    const c = fixture.componentInstance; tick(1000); fixture.detectChanges();
    expect(c.history.length).toBe(1); expect(c.heightRecord!.maximum).toBe(9232n);
    c.limit = 1; c.example(97); tick(1000); expect(c.history.length).toBe(1);
    c.limit = 10000; c.example(6); tick(1000);
    expect(c.history.length).toBe(2); expect(c.durationRecord!.start).toBe(27n);
    c.example(871); c.stop(); tick(1000); expect(c.run!.steps).toBe(0);
    c.clearHistory(); expect(c.heightRecord).toBeNull(); expect(c.history).toEqual([]);
    c.input = (2n ** 1100n).toString(); c.calculate();
    c.plot(); expect(c.path).not.toMatch(/NaN|Infinity/);
    c.logarithmic = false; c.plot(); expect(c.path).not.toMatch(/NaN|Infinity/);
    fixture.destroy(); tick(1000); expect(c.run!.steps).toBe(0);
  }));
});
