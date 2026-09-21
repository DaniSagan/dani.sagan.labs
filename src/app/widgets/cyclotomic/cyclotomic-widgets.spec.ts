import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CyclotomicRootsComponent } from './cyclotomic-roots.component';
import { CyclotomicFractalComponent } from './cyclotomic-fractal.component';
import { CyclotomicNewtonComponent } from './cyclotomic-newton.component';

describe('Cyclotomic widgets', () => {
  it('renders the primitive-root explorer and updates the order controls', async () => {
    await TestBed.configureTestingModule({ imports: [CyclotomicRootsComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CyclotomicRootsComponent); fixture.detectChanges();
    fixture.componentInstance.setN(12); fixture.componentInstance.k = 4; fixture.detectChanges();
    expect(fixture.componentInstance.order).toBe(3);
    expect(fixture.nativeElement.textContent).toContain('no es primitiva');
    fixture.componentInstance.setN(105); fixture.detectChanges();
    expect(fixture.componentInstance.maximum).toBe(2);
    expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    fixture.componentInstance.setN(1); fixture.detectChanges();
    expect(fixture.componentInstance.k).toBe(0); expect(fixture.componentInstance.degree).toBe(1);
    fixture.destroy();
  });
  it('draws the root cloud, validates the viewport, and cancels scheduled drawing on destroy', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [CyclotomicFractalComponent] });
    const fixture = TestBed.createComponent(CyclotomicFractalComponent); fixture.detectChanges(); tick(20);
    const c = fixture.componentInstance;
    expect(c.points.length).toBe(16384); expect(c.visible).toBeGreaterThan(0);
    c.span = 0; c.view(); expect(c.error).not.toBe('');
    c.preset('classic'); tick(20); expect(c.error).toBe(''); expect(c.visible).toBe(16384);
    c.depth = 0; c.generate(); tick(20); expect(c.points).toEqual([{re:-1,im:0}]);
    const cancel = spyOn(window, 'cancelAnimationFrame').and.callThrough();
    fixture.destroy(); expect(cancel).toHaveBeenCalled();
  }));
  it('renders Newton progressively and cancels work when stopped or destroyed', fakeAsync(() => {
    TestBed.configureTestingModule({ imports: [CyclotomicNewtonComponent] });
    const fixture = TestBed.createComponent(CyclotomicNewtonComponent);
    const c = fixture.componentInstance; c.size = 24; c.n = 1; c.update();
    fixture.detectChanges(); tick(1000);
    expect(c.progress).toBe(100); expect(c.drawing).toBe(false);
    c.re = NaN; c.select(); expect(c.error).not.toBe('');
    c.re = 0; c.im = 0; c.select(); expect(c.error).toBe('');
    c.n = 8; c.update(); c.stop(); expect(c.selected.reason).toBe('singular');
    fixture.detectChanges(); expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    const cancel = spyOn(window, 'cancelAnimationFrame').and.callThrough();
    fixture.destroy(); expect(cancel).toHaveBeenCalled();
  }));
});
