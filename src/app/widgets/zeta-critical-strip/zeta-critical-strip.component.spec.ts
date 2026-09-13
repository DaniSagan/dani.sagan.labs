import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ZetaCriticalStripComponent } from './zeta-critical-strip.component';

describe('ZetaCriticalStripComponent', () => {
  let fixture: ComponentFixture<ZetaCriticalStripComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZetaCriticalStripComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(ZetaCriticalStripComponent);
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());
  it('renders both plots and explores a zero', () => {
    expect(fixture.nativeElement.querySelectorAll('svg').length).toBe(2);
    const component = fixture.componentInstance;
    component.firstZero();
    fixture.detectChanges();
    expect(Math.hypot(component.point.re, component.point.im)).toBeLessThan(
      1e-10,
    );
    expect(component.realPath).not.toContain('NaN');
  });
  it('retains the plotted interval when new input is invalid', () => {
    const component = fixture.componentInstance;
    component.start = 5;
    component.end = 5;
    component.plot();
    expect(component.error).not.toBe('');
    expect(component.plottedStart).toBe(0);
    expect(component.plottedEnd).toBe(40);
    component.sigma = 0;
    component.end = 20;
    component.plot();
    expect(component.error).not.toBe('');
  });
  it('animates and releases its timer when destroyed', fakeAsync(() => {
    const component = fixture.componentInstance;
    component.toggle();
    tick(80);
    expect(component.t).toBeGreaterThan(0);
    component.ngOnDestroy();
    const last = component.t;
    tick(80);
    expect(component.t).toBe(last);
    expect(component.playing).toBeFalse();
  }));
});
