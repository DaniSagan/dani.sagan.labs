import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NumerationLabComponent } from './numeration-lab.component';
import { SignedIntegersComponent } from './signed-integers.component';
import { NUMERATION_EXERCISES } from '../../articles/number-theory/numeration/numeration-exercises';

describe('Numeration laboratory', () => {
  let fixture: ComponentFixture<NumerationLabComponent>,
    lab: NumerationLabComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumerationLabComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(NumerationLabComponent);
    lab = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('exposes the positional and division procedures in opposite orders', () => {
    expect(lab.output).toBe('10011100');
    expect(lab.suffix).toBe('0');
    lab.move(999);
    expect(lab.suffix).toBe(lab.output);
    lab.move(-999);
    expect(lab.step).toBe(0);
    lab.preset('2431', 5, 10);
    expect(lab.value).toBe(366n);
    lab.selected = 1;
    expect(lab.place.contribution).toBe(100n);
    lab.moveHorner(999);
    expect(lab.hornerRows[lab.hornerRows.length - 1].after).toBe(366n);
    lab.moveHorner(-999);
    expect(lab.hornerStep).toBe(0);
  });
  it('hides stale values on invalid input and recovers', () => {
    lab.preset('102', 2, 10);
    fixture.detectChanges();
    expect(lab.error).not.toBe('');
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    lab.preset('-45', 10, 5);
    fixture.detectChanges();
    expect(lab.error).toBe('');
    expect(lab.output).toBe('-140');
    expect(lab.terms.reduce((n, t) => n + t.contribution, 0n)).toBe(45n);
    lab.preset('-000', 10, 2);
    expect(lab.output).toBe('0');
    expect(lab.divisions.length).toBe(1);
  });
  it('supports the longest input without losing precision or rendering every division', () => {
    lab.preset('Z'.repeat(120), 36, 2);
    expect(lab.error).toBe('');
    expect(lab.divisions.length).toBeGreaterThan(600);
    lab.move(999);
    fixture.detectChanges();
    expect(lab.rows.length).toBe(8);
    expect(lab.equivalents.find((r) => r.base === 10)!.text).toBe(
      lab.value.toString(),
    );
    expect(NUMERATION_EXERCISES.length).toBe(16);
    expect(
      NUMERATION_EXERCISES.every(
        (e) => e.hints.length === 4 && e.solution.length > 50,
      ),
    ).toBeTrue();
  });
});
describe('Signed integer explorer', () => {
  it('decodes toggled bits, reports overflow and recovers after width changes', () => {
    const widget = new SignedIntegersComponent();
    widget.flip(0);
    expect(widget.value).toBe(115n);
    widget.text = '-128';
    widget.update();
    expect(widget.encoding.signMagnitude).toBeNull();
    widget.width = 4;
    widget.update();
    expect(widget.error).not.toBe('');
    widget.text = '-8';
    widget.update();
    expect(widget.error).toBe('');
    expect(widget.encoding.twos).toBe('1000');
    widget.flip(0);
    expect(widget.value).toBe(0n);
  });
});
