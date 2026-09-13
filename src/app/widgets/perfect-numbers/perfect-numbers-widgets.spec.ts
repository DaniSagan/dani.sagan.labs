import { TestBed } from '@angular/core/testing';
import { DivisorBalanceComponent } from './divisor-balance.component';
import { MersenneBuilderComponent } from './mersenne-builder.component';

describe('perfect number widgets', () => {
  it('updates selected contributions without changing the classification', async () => {
    await TestBed.configureTestingModule({ imports: [DivisorBalanceComponent] }).compileComponents();
    const fixture = TestBed.createComponent(DivisorBalanceComponent);
    const component = fixture.componentInstance;
    component.example(12); component.clear(); [2, 4, 6].forEach(d => component.toggle(d)); fixture.detectChanges();
    expect(component.partial).toBe(12);
    expect(component.classification).toBe('abundante');
    expect(fixture.nativeElement.querySelectorAll('[aria-pressed=true]').length).toBe(3);
    component.input = null; component.calculate();
    expect(component.error).not.toBe(''); expect(component.n).toBe(12);
    component.example(1); fixture.detectChanges();
    expect(component.partial).toBe(0); expect(component.classification).toBe('deficiente');
    fixture.destroy();
  });
  it('renders a failed construction and the corresponding binary pattern', async () => {
    await TestBed.configureTestingModule({ imports: [MersenneBuilderComponent] }).compileComponents();
    const fixture = TestBed.createComponent(MersenneBuilderComponent);
    fixture.componentInstance.p = 11; fixture.componentInstance.update(); fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('El candidato no es perfecto');
    expect(fixture.nativeElement.querySelectorAll('.one').length).toBe(11);
    expect(fixture.nativeElement.querySelectorAll('.zero').length).toBe(10);
    fixture.destroy();
  });
});
