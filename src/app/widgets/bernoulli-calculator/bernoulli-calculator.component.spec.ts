import { TestBed } from '@angular/core/testing';
import { BernoulliCalculatorComponent } from './bernoulli-calculator.component';

describe('BernoulliCalculatorComponent', () => {
  it('renders exact results and clears stale output for invalid input', async () => {
    await TestBed.configureTestingModule({ imports: [BernoulliCalculatorComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BernoulliCalculatorComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('-691 / 2730');
    fixture.componentInstance.example(0); fixture.detectChanges();
    expect(fixture.componentInstance.result).toBe('1');
    expect(fixture.componentInstance.rows.length).toBe(1);
    fixture.componentInstance.index = null; fixture.componentInstance.calculate(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('índice');
    fixture.componentInstance.example(2.5);
    expect(fixture.componentInstance.error).toContain('entero');
    fixture.destroy();
  });
});
