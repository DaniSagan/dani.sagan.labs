import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ModularClockComponent } from './modular-clock.component';
import { ResidueClassesComponent } from './residue-classes.component';
import { ModularTableComponent } from './modular-table.component';
import { ModularInverseComponent } from './modular-inverse.component';
import { ModularPowersComponent } from './modular-powers.component';
import { SelfAssessmentComponent } from '../self-assessment/self-assessment.component';
import { MODULAR_EXERCISES } from '../../articles/number-theory/modular-arithmetic/modular-exercises';

describe('Modular explorations', () => {
  it('steps, pauses, resets on edits, and clears playback when destroyed', fakeAsync(() => {
    const clock = new ModularClockComponent();
    clock.toggle();
    tick(700);
    expect(clock.step).toBe(1);
    clock.toggle();
    tick(1400);
    expect(clock.step).toBe(1);
    clock.move(-1);
    expect(clock.step).toBe(0);
    clock.toggle();
    tick(3500);
    expect(clock.complete).toBeTrue();
    expect(clock.current.residue).toBe(3);
    expect(clock.playing).toBeFalse();
    clock.preset(7, 2, 5, 'subtract');
    clock.toggle();
    clock.a = 1.5;
    clock.update();
    tick(1400);
    expect(clock.error).not.toBe('');
    expect(clock.step).toBe(0);
    expect(clock.playing).toBeFalse();
    clock.preset(7, 2, 6, 'power');
    clock.toggle();
    clock.ngOnDestroy();
    tick(1400);
    expect(clock.step).toBe(0);
    expect(clock.playing).toBeFalse();
  }));

  it('groups negative integers and supports the single class modulo one', () => {
    const classes = new ResidueClassesComponent();
    expect(classes.rows[3].examples).toEqual([-12, -7, -2, 3, 8, 13]);
    classes.aText = '-999999999999999999';
    classes.update();
    expect(classes.residue).toBe(1);
    classes.n = 1;
    classes.update();
    expect(classes.residue).toBe(0);
    expect(classes.rows.length).toBe(1);
    classes.aText = '1e3';
    classes.update();
    expect(classes.error).not.toBe('');
    classes.select(0);
    expect(classes.error).toBe('');
  });

  it('distinguishes inverses and nonzero zero divisors in a multiplication table', () => {
    const table = new ModularTableComponent();
    expect(table.units).toEqual([1, 5]);
    expect(table.zeroDivisor(2, 3)).toBeTrue();
    expect(table.zeroDivisor(0, 3)).toBeFalse();
    table.n = 7;
    table.update();
    expect(table.units).toEqual([1, 2, 3, 4, 5, 6]);
    expect(
      table.residues.some((a) =>
        table.residues.some((b) => table.zeroDivisor(a, b)),
      ),
    ).toBeFalse();
    table.operation = 'add';
    for (const a of table.residues) {
      expect(new Set(table.residues.map((b) => table.value(a, b))).size).toBe(
        7,
      );
    }
    table.n = 0;
    expect(table.valid).toBeFalse();
    expect(table.residues).toEqual([]);
  });

  it('finds inverse witnesses and bounds the visual enumeration', () => {
    const inverse = new ModularInverseComponent();
    expect(inverse.result.inverse).toBe(38n);
    expect(
      inverse.candidates
        .filter((candidate) => candidate.inverse)
        .map((candidate) => candidate.x),
    ).toEqual([38]);
    inverse.preset('2', '6');
    expect(inverse.exists).toBeFalse();
    expect(
      inverse.candidates.some((candidate) => candidate.inverse),
    ).toBeFalse();
    inverse.preset('0', '7');
    expect(inverse.exists).toBeFalse();
    inverse.preset('2', '999999999999999999');
    expect(inverse.exists).toBeTrue();
    expect(inverse.candidates).toEqual([]);
    inverse.preset('2', '1');
    expect(inverse.error).not.toBe('');
  });

  it('uses the correct cycle index for large exponents and nontrivial tails', () => {
    const powers = new ModularPowersComponent();
    expect(powers.power.value).toBe(2n);
    powers.preset('2', 8, '999999999999999999');
    expect(powers.cycleIndex).toBe(3);
    expect(powers.power.value).toBe(0n);
    powers.exponentText = '2';
    powers.update();
    expect(powers.cycleIndex).toBe(2);
    expect(powers.power.value).toBe(4n);
    powers.preset('0', 1, '0');
    expect(powers.visible).toBe(0);
    expect(powers.power.value).toBe(0n);
    powers.exponentText = '-1';
    powers.update();
    expect(powers.error).not.toBe('');
  });

  it('hides stale inverse output after invalid input and renders the recovery', async () => {
    await TestBed.configureTestingModule({
      imports: [ModularInverseComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(ModularInverseComponent);
    fixture.detectChanges();
    fixture.componentInstance.preset('1.5', '7');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    fixture.componentInstance.preset('-3', '11');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.result').textContent,
    ).toContain('7');
    expect(fixture.nativeElement.querySelector('[role=alert]')).toBeNull();
    fixture.destroy();
  });

  it('checks numerical and conceptual responses and progressively reveals hints', async () => {
    await TestBed.configureTestingModule({
      imports: [SelfAssessmentComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(SelfAssessmentComponent);
    const quiz = fixture.componentInstance;
    quiz.quizId = 'test-modular';
    quiz.questions = MODULAR_EXERCISES;
    fixture.detectChanges();
    for (const exercise of quiz.exercises.filter(
      (exercise) => exercise.answer,
    )) {
      exercise.input = exercise.answer!;
      quiz.check(exercise);
      expect(exercise.feedback).toContain('Correcto');
    }
    const negative = quiz.exercises[1];
    negative.input = '';
    quiz.check(negative);
    expect(negative.feedback).toContain('Escribe');
    negative.input = '3.0';
    quiz.check(negative);
    expect(negative.feedback).toContain('Todavía no');
    negative.input = '+003';
    quiz.check(negative);
    expect(negative.feedback).toContain('Correcto');
    const first: HTMLElement = fixture.nativeElement.querySelector('.exercise');
    const hint = Array.from(first.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Pista'),
    )!;
    const solution = Array.from(first.querySelectorAll('button')).find(
      (button) => button.textContent?.includes('Revelar'),
    )!;
    expect(solution.disabled).toBeTrue();
    hint.click();
    fixture.detectChanges();
    expect(first.textContent).toContain('Calcula la diferencia');
    expect(solution.disabled).toBeTrue();
    hint.click();
    fixture.detectChanges();
    expect(solution.disabled).toBeFalse();
    solution.click();
    fixture.detectChanges();
    expect(first.querySelector('.result')?.textContent).toContain('21 = 7·3');
    expect(fixture.nativeElement.querySelector('textarea')).not.toBeNull();
    fixture.destroy();
  });
});
