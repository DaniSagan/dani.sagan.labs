import { TestBed } from '@angular/core/testing';
import { SandpileExplorerComponent } from './sandpile-explorer.component';
import { SandpileAbelianComponent } from './sandpile-abelian.component';
import { SandpileAvalanchesComponent } from './sandpile-avalanches.component';

describe('Sandpile laboratories', () => {
  it('edits a selected cell, displays heights and preserves the grain balance', async () => {
    await TestBed.configureTestingModule({ imports: [SandpileExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(SandpileExplorerComponent), c = fixture.componentInstance;
    c.size = 9; c.reset('empty'); fixture.detectChanges(); await fixture.whenStable();
    const sliders: NodeListOf<HTMLInputElement> = fixture.nativeElement.querySelectorAll('input');
    sliders[0].value = '0'; sliders[0].dispatchEvent(new Event('input'));
    sliders[1].value = '0'; sliders[1].dispatchEvent(new Event('input'));
    c.brush = 4; c.add(); c.step(); fixture.detectChanges();
    expect(c.selected).toBe(0); expect(c.pile.lost).toBe(2); expect(c.pile.mass).toBe(2);
    expect(c.injected).toBe(c.pile.mass + c.pile.lost);
    expect(fixture.nativeElement.querySelector('canvas').getAttribute('aria-label')).toContain('arena');
    expect(fixture.nativeElement.textContent).toContain('Configuración estable');
    fixture.destroy();
  });
  it('cancels pattern animation on destruction', () => {
    const c = new SandpileExplorerComponent();
    spyOn(window, 'requestAnimationFrame').and.returnValue(42);
    const cancel = spyOn(window, 'cancelAnimationFrame');
    c.run('fast'); c.ngOnDestroy();
    expect(cancel).toHaveBeenCalledWith(42); expect(c.mode).toBeNull();
  });
  it('shows intermediate differences and final equality for both legal schedules', async () => {
    await TestBed.configureTestingModule({ imports: [SandpileAbelianComponent] }).compileComponents();
    const callbacks: FrameRequestCallback[] = [];
    spyOn(window, 'requestAnimationFrame').and.callFake(cb => { callbacks.push(cb); return 1; });
    const fixture = TestBed.createComponent(SandpileAbelianComponent), c = fixture.componentInstance;
    fixture.detectChanges(); c.step(); fixture.detectChanges();
    expect(c.differences).toBeGreaterThan(0);
    c.finish();
    let frames = 0;
    while (callbacks.length && frames++ < 1000) callbacks.shift()!(0);
    fixture.detectChanges();
    expect(c.done).toBe(true); expect(c.differences).toBe(0); expect(c.odometerDifferences).toBe(0);
    expect(fixture.nativeElement.textContent).toContain('Coinciden todas las alturas');
    fixture.destroy();
  });
  it('runs an avalanche batch, displays finite graphs and resets its data', async () => {
    await TestBed.configureTestingModule({ imports: [SandpileAvalanchesComponent] }).compileComponents();
    const callbacks: FrameRequestCallback[] = [];
    spyOn(window, 'requestAnimationFrame').and.callFake(cb => { callbacks.push(cb); return 1; });
    const fixture = TestBed.createComponent(SandpileAvalanchesComponent), c = fixture.componentInstance;
    c.size = 15; c.warmupFactor = 5; c.batch = 100; c.reset(); fixture.detectChanges(); c.start();
    let frames = 0;
    while (callbacks.length && frames++ < 1000) callbacks.shift()!(0);
    fixture.detectChanges();
    expect(c.samples.length).toBe(100); expect(c.playing).toBe(false);
    expect(c.positive).toBeGreaterThan(0); expect(c.tailPath).not.toMatch(/NaN|Infinity/);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(10);
    c.reset(); fixture.detectChanges();
    expect(c.samples.length).toBe(0); expect(c.tailPath).toBe('');
    fixture.destroy();
  });
});
