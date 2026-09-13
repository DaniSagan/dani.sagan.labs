import { TestBed } from '@angular/core/testing';
import { ZetaCalculatorComponent } from './zeta-calculator.component';

describe('ZetaCalculatorComponent', () => {
  it('renders a result and replaces it with an explanation for a pole or missing input', async () => {
    await TestBed.configureTestingModule({
      imports: [ZetaCalculatorComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ZetaCalculatorComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.result').textContent,
    ).toContain('1.64493407');
    fixture.componentInstance.example(1, 0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'polo',
    );
    fixture.componentInstance.re = null;
    fixture.componentInstance.calculate();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error').textContent).toContain(
      'Completa',
    );
    fixture.destroy();
  });
});
