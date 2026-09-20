import { TestBed } from '@angular/core/testing';
import { BaselConvergenceComponent } from './basel-convergence.component';
import { BaselFourierComponent } from './basel-fourier.component';

describe('Basel interactive widgets', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BaselConvergenceComponent, BaselFourierComponent]
    }).compileComponents();
  });

  it('updates the convergence chart from its controls and switches to the error view', () => {
    const fixture = TestBed.createComponent(BaselConvergenceComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const buttons: HTMLButtonElement[] = Array.from(fixture.nativeElement.querySelectorAll('.presets button'));
    buttons[3].click();
    fixture.detectChanges();
    expect(component.n).toBe(1000);
    expect(fixture.nativeElement.querySelector('output').textContent).toContain('1000');
    fixture.nativeElement.querySelectorAll('.switch button')[1].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.upper-line')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('.lower-line')).toBeTruthy();
    expect(component.errorPath).not.toMatch(/NaN|Infinity/);
    fixture.destroy();
  });

  it('preserves the last valid calculation when numeric input is invalid', () => {
    const component = new BaselConvergenceComponent();
    for (const value of [null, 0, 1.5, 10001]) {
      component.inputN = value;
      component.fromInput();
      expect(component.n).toBe(10);
      expect(component.error).not.toBe('');
    }
    component.fromSlider(4);
    expect(component.n).toBe(10000);
    expect(component.error).toBe('');
  });

  it('reconstructs the parabola and resets the observation point to pi', () => {
    const fixture = TestBed.createComponent(BaselFourierComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const before = component.error;
    fixture.nativeElement.querySelectorAll('.presets button')[3].click();
    fixture.detectChanges();
    expect(component.n).toBe(80);
    expect(component.error).toBeLessThan(before);
    expect(component.approximationPath).not.toMatch(/NaN|Infinity/);
    component.selectPosition(0);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.two-controls > div:last-child button').click();
    fixture.detectChanges();
    expect(component.position).toBe(1);
    expect(fixture.nativeElement.querySelector('.insight .eyebrow').textContent).toContain('BASILEA');
    fixture.destroy();
  });
});
