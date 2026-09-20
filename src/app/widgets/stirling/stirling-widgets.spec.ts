import { TestBed } from '@angular/core/testing';
import { StirlingAccuracyComponent } from './stirling-accuracy.component';
import { StirlingLaplaceComponent } from './stirling-laplace.component';

describe('Stirling widgets', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [StirlingAccuracyComponent, StirlingLaplaceComponent] }).compileComponents();
  });
  it('updates the approximation selector and large-factorial controls', () => {
    const fixture = TestBed.createComponent(StirlingAccuracyComponent);
    fixture.detectChanges();
    fixture.nativeElement.querySelectorAll('.tabs button')[2].click();
    fixture.nativeElement.querySelectorAll('.presets button')[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.n).toBe(1000);
    expect(fixture.componentInstance.method).toBe(2);
    expect(fixture.nativeElement.querySelector('.metrics').textContent).toContain('2567');
    expect(fixture.componentInstance.paths.join()).not.toMatch(/NaN|Infinity/);
    expect(fixture.componentInstance.formatError(0)).toContain('10');
    fixture.destroy();
  });
  it('preserves valid state after an invalid number input', () => {
    const component = new StirlingAccuracyComponent();
    for (const value of [null, 0, 1001, 3.5]) {
      component.inputN = value; component.fromInput();
      expect(component.n).toBe(10);
      expect(component.error).not.toBe('');
    }
    component.fromSlider(3);
    expect(component.n).toBe(1000);
    expect(component.error).toBe('');
  });
  it('updates the Laplace profile and support boundary', () => {
    const fixture = TestBed.createComponent(StirlingLaplaceComponent);
    fixture.detectChanges();
    const before = fixture.componentInstance.kernelPath;
    fixture.nativeElement.querySelectorAll('.presets button')[4].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.n).toBe(1000);
    expect(fixture.componentInstance.kernelPath).not.toBe(before);
    expect(fixture.componentInstance.kernelPath).not.toMatch(/NaN|Infinity/);
    expect(fixture.nativeElement.querySelector('.chart .floor')).toBeNull();
    fixture.destroy();
  });
});
