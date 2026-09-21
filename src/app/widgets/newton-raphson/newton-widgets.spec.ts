import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NewtonTangentComponent } from './newton-tangent.component';
import { NewtonConvergenceComponent } from './newton-convergence.component';
import { NewtonBasinsComponent } from './newton-basins.component';

describe('Newton–Raphson laboratories', () => {
  it('updates the seed from its accessible slider and renders a singular derivative', async () => {
    await TestBed.configureTestingModule({
      imports: [NewtonTangentComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NewtonTangentComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.seed).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Derivada nula');
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
    fixture.destroy();
  });
  it('plays through a cycle, stops automatically and cleans up on destruction', fakeAsync(() => {
    const c = new NewtonTangentComponent();
    c.choice = 3;
    c.select();
    c.toggle();
    tick(2000);
    expect(c.step).toBe(2);
    expect(c.playing).toBe(false);
    c.toggle();
    tick(1000);
    c.ngOnDestroy();
    const previous = c.step;
    tick(2000);
    expect(c.step).toBe(previous);
    expect(c.playing).toBe(false);
  }));
  it('exposes a multiplicity-aware comparison and keeps the error plot finite', async () => {
    await TestBed.configureTestingModule({
      imports: [NewtonConvergenceComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(NewtonConvergenceComponent);
    fixture.componentInstance.multiple = true;
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('Newton × 3');
    for (const s of fixture.componentInstance.series)
      expect(s.path).not.toMatch(/NaN|Infinity/);
    expect(fixture.componentInstance.series[2].values[1]).toBeCloseTo(
      Math.SQRT2,
      12,
    );
    fixture.destroy();
  });
  it('renders the full basin progressively and cancels pending work on teardown', async () => {
    await TestBed.configureTestingModule({
      imports: [NewtonBasinsComponent],
    }).compileComponents();
    const callbacks: FrameRequestCallback[] = [];
    spyOn(window, 'requestAnimationFrame').and.callFake((callback) => {
      callbacks.push(callback);
      return callbacks.length;
    });
    const cancel = spyOn(window, 'cancelAnimationFrame');
    const fixture = TestBed.createComponent(NewtonBasinsComponent);
    fixture.detectChanges();
    const c = fixture.componentInstance;
    expect(c.drawing).toBe(true);
    let count = 0;
    while (callbacks.length && count++ < 30) callbacks.shift()!(0);
    expect(c.progress).toBe(100);
    expect(c.drawing).toBe(false);
    const canvas: HTMLCanvasElement =
      fixture.nativeElement.querySelector('canvas');
    const pixel = canvas.getContext('2d')!.getImageData(225, 150, 1, 1).data;
    expect(pixel[3]).toBe(255);
    expect(pixel[1]).toBeGreaterThan(pixel[0]); // Near the root 1: mint basin.
    c.re = 0;
    c.im = 0;
    c.select();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('singularidad');
    c.zoom();
    expect(c.span).toBe(2);
    fixture.destroy();
    expect(cancel).toHaveBeenCalled();
  });
});
