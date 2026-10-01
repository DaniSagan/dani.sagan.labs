import { Component, Input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { GrahamLabComponent } from './graham-lab.component';
import { GrahamDigitsComponent } from './graham-digits.component';

@Component({
  selector: 'app-formula',
  standalone: true,
  template: '{{ expression }}',
})
class FormulaStub {
  @Input() expression = '';
}

describe('Graham widgets', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrahamLabComponent, GrahamDigitsComponent],
    })
      .overrideComponent(GrahamLabComponent, {
        remove: { imports: [FormulaComponent] },
        add: { imports: [FormulaStub] },
      })
      .overrideComponent(GrahamDigitsComponent, {
        remove: { imports: [FormulaComponent] },
        add: { imports: [FormulaStub] },
      })
      .compileComponents();
  });
  it('switches between exact and symbolic output and clears stale results on errors', () => {
    const f = TestBed.createComponent(GrahamLabComponent),
      lab = f.componentInstance;
    f.detectChanges();
    expect(f.nativeElement.querySelector('.exact').textContent).toContain(
      '7625597484987',
    );
    lab.example(3, 2, 4);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.exact')).toBeNull();
    expect(f.nativeElement.textContent).toContain('200 cifras');
    lab.base = 1;
    lab.update();
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    lab.example(2, 3, 3);
    f.detectChanges();
    expect(f.nativeElement.querySelector('.exact').textContent).toContain(
      '65536',
    );
  });
  it('allows all 64 definitions without evaluating any Graham term', () => {
    const f = TestBed.createComponent(GrahamLabComponent),
      lab = f.componentInstance;
    f.detectChanges();
    const levels = f.nativeElement.querySelectorAll('.levels button');
    expect(levels.length).toBe(64);
    levels[63].click();
    f.detectChanges();
    expect(lab.level).toBe(64);
    expect(lab.definition).toContain('g_{63}');
    levels[1].click();
    f.detectChanges();
    expect(lab.definition).toContain('g_{1}');
  });
  it('validates numeric DOM inputs while typing', () => {
    const f = TestBed.createComponent(GrahamLabComponent);
    f.detectChanges();
    const input = f.nativeElement.querySelector('input');
    input.value = '100000';
    input.dispatchEvent(new Event('input'));
    f.detectChanges();
    expect(f.nativeElement.querySelector('[role=alert]')).not.toBeNull();
  });
  it('shows stable digits, preserves leading zeros and handles invalid widths', () => {
    const f = TestBed.createComponent(GrahamDigitsComponent),
      lab = f.componentInstance;
    f.detectChanges();
    expect(lab.result.suffix).toBe('2464195387');
    lab.height = lab.result.height;
    f.detectChanges();
    expect(lab.towerSuffix).toBe(lab.result.suffix);
    expect(lab.rows.length).toBe(5);
    lab.digits = 20;
    lab.update();
    f.detectChanges();
    expect(lab.result.suffix.startsWith('0')).toBeTrue();
    expect(lab.height).toBe(1);
    lab.digits = 99;
    lab.update();
    f.detectChanges();
    expect(f.nativeElement.querySelector('.suffix')).toBeNull();
    lab.digits = 30;
    lab.update();
    f.detectChanges();
    expect(lab.error).toBe('');
    expect(lab.result.suffix.length).toBe(30);
  });
});
