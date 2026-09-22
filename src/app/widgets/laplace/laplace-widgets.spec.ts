import { TestBed } from '@angular/core/testing';
import { LaplaceConvergenceComponent } from './laplace-convergence.component';
import { LaplacePolesComponent } from './laplace-poles.component';
import { LaplaceConvolutionComponent } from './laplace-convolution.component';

describe('Laplace interactive widgets', () => {
  it('distinguishes convergence from the finite integral at the pole', () => {
    const fixture = TestBed.createComponent(LaplaceConvergenceComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.converges).toBeTrue();
    fixture.componentInstance.preset(0.5, 0);
    fixture.detectChanges();
    expect(fixture.componentInstance.value.re).toBe(
      fixture.componentInstance.time,
    );
    expect(
      fixture.nativeElement.querySelector('[role=status]').textContent,
    ).toContain('no converge');
    expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    fixture.destroy();
  });
  it('updates the critical response and displays the undamped stability caveat', () => {
    const fixture = TestBed.createComponent(LaplacePolesComponent);
    fixture.componentInstance.setZeta(1);
    fixture.detectChanges();
    expect(fixture.componentInstance.poles[0].re).toBe(-2);
    expect(fixture.nativeElement.textContent).toContain(
      'Críticamente amortiguado',
    );
    fixture.componentInstance.setZeta(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'no hay estabilidad BIBO',
    );
    expect(fixture.nativeElement.innerHTML).not.toContain('NaN');
    fixture.destroy();
  });
  it('keeps the convolution causal when the cursor is before the input', () => {
    const fixture = TestBed.createComponent(LaplaceConvolutionComponent);
    fixture.componentInstance.time = 1;
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBe(0);
    expect(
      fixture.componentInstance.product[2].values.every((v) => v === 0),
    ).toBeTrue();
    fixture.componentInstance.time = 4;
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(fixture.componentInstance.value).toBeGreaterThan(0);
    expect(
      fixture.nativeElement.querySelectorAll('app-laplace-plot svg').length,
    ).toBe(2);
    fixture.destroy();
  });
});
