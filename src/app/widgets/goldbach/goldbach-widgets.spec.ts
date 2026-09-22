import { TestBed } from '@angular/core/testing';
import { GoldbachPairsComponent } from './goldbach-pairs.component';
import { GoldbachCometComponent } from './goldbach-comet.component';
import { GoldbachSieveComponent } from './goldbach-sieve.component';

describe('Goldbach laboratories', () => {
  it('keeps the last valid result after an invalid submission and resets pagination', () => {
    const fixture = TestBed.createComponent(GoldbachPairsComponent);
    const component = fixture.componentInstance;
    component.setNumber(100000);
    component.page = 2;
    component.setNumber(5);
    expect(component.n).toBe(100000);
    expect(component.error).not.toBe('');
    component.setNumber(4);
    fixture.detectChanges();
    expect(component.page).toBe(0);
    expect(component.error).toBe('');
    expect(
      fixture.nativeElement.querySelector('.selection').textContent,
    ).toContain('2 + 2');
    fixture.destroy();
  });
  it('filters exact comet data and keeps inspection in bounds after reducing the range', () => {
    const fixture = TestBed.createComponent(GoldbachCometComponent);
    const component = fixture.componentInstance;
    component.limit = 5000;
    component.selected = 4000;
    component.changeLimit();
    expect(component.visible.length).toBe(2499);
    component.limit = 100;
    component.residue = 0;
    component.changeLimit();
    fixture.detectChanges();
    expect(component.selected).toBe(100);
    expect(component.current.count).toBe(6);
    expect(
      component.visible.every((d) => d.n % 6 === 0 && d.n <= 100),
    ).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('svg circle').length).toBe(
      component.visible.length + 1,
    );
    fixture.destroy();
  });
  it('allows modular filters to be toggled without hiding genuine prime pairs', () => {
    const fixture = TestBed.createComponent(GoldbachSieveComponent);
    const component = fixture.componentInstance;
    component.active = [2, 3, 5];
    expect(
      component.candidates.find((c) => c.p === 23)?.divisor,
    ).toBeUndefined();
    component.toggle(7);
    expect(component.candidates.find((c) => c.p === 23)?.divisor).toBe(7);
    component.active = [...component.divisors];
    component.reveal = true;
    fixture.detectChanges();
    expect(component.survivors).toBe(6);
    expect(fixture.nativeElement.querySelectorAll('.cell.prime').length).toBe(
      6,
    );
    fixture.destroy();
  });
});
