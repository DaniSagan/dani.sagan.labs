import { TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';
import { DivisibilityLabComponent } from './divisibility-lab.component';
import { CriterionDiscoveryComponent } from './criterion-discovery.component';
import { DivisibilityBasesComponent } from './divisibility-bases.component';
import { SelfAssessmentComponent } from '../self-assessment/self-assessment.component';
import { DIVISIBILITY_EXERCISES } from '../../articles/number-theory/divisibility-rules/divisibility-exercises';

describe('Divisibility explorations', () => {
  it('moves through a criterion, clamps endpoints and resets after edits', () => {
    const lab = new DivisibilityLabComponent();
    lab.move(1);
    expect(lab.current.output).toBe(-22n);
    lab.move(100);
    expect(lab.complete).toBeTrue();
    lab.move(-100);
    expect(lab.step).toBe(0);
    lab.preset('1001', 13);
    lab.move(2);
    expect(lab.current.output).toBe(26n);
    lab.preset('-104', 8);
    expect(lab.step).toBe(0);
    expect(lab.trace.divisible).toBeTrue();
    expect(lab.quotient).toBe(-13n);
    lab.preset('0', 7);
    expect(lab.trace.divisible).toBeTrue();
  });

  it('hides stale lab results after invalid input and recovers', async () => {
    await TestBed.configureTestingModule({
      imports: [MathjaxModule.forRoot(), DivisibilityLabComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DivisibilityLabComponent);
    fixture.detectChanges();
    fixture.componentInstance.preset('1e6', 7);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    fixture.componentInstance.preset('15', 6);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.result').textContent,
    ).toContain('no es');
    expect(fixture.nativeElement.querySelector('[role=alert]')).toBeNull();
    fixture.destroy();
  });

  it('applies positive, negative and zero power patterns and resets the selected rule', () => {
    const discovery = new CriterionDiscoveryComponent();
    discovery.preset(101);
    discovery.selected = discovery.discovery.patterns.find(
      (pattern) => pattern.kind === 'minus-one',
    )!;
    discovery.numberText = '-123422';
    discovery.updateNumber();
    expect(discovery.application?.sum).toBe(0n);
    expect(discovery.application?.divisible).toBeTrue();
    discovery.preset(37);
    expect(discovery.selected).toBeNull();
    expect(discovery.interpreted).toBeFalse();
    discovery.selected = discovery.discovery.patterns[0];
    discovery.numberText = '123321';
    discovery.updateNumber();
    expect(discovery.application?.sum).toBe(444n);
    discovery.preset(4);
    discovery.selected = discovery.discovery.patterns[0];
    discovery.numberText = '7316';
    discovery.updateNumber();
    expect(discovery.application?.sum).toBe(16n);
    discovery.numberText = '';
    discovery.updateNumber();
    expect(discovery.application).toBeNull();
    expect(discovery.numberError).not.toBe('');
    discovery.preset(6);
    expect(discovery.discovery.patterns).toEqual([]);
  });

  it('reveals an interpretation only when requested and invalidates it after changing the modulus', async () => {
    await TestBed.configureTestingModule({
      imports: [CriterionDiscoveryComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CriterionDiscoveryComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pattern')).toBeNull();
    const reveal: HTMLButtonElement = Array.from(
      fixture.nativeElement.querySelectorAll(
        'button',
      ) as NodeListOf<HTMLButtonElement>,
    ).find((button) => button.textContent?.includes('Interpretar patrones'))!;
    reveal.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.pattern').length).toBe(2);
    fixture.componentInstance.preset(6);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.pattern')).toBeNull();
    fixture.componentInstance.modulus = 0;
    fixture.componentInstance.update();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    fixture.destroy();
  });

  it('keeps decimal input separate from its representation in another base', () => {
    const bases = new DivisibilityBasesComponent();
    expect(bases.representation.encoded).toBe('77');
    bases.preset('143', 12);
    expect(bases.representation.encoded).toBe('BB');
    expect(bases.representation.sum).toBe(22);
    expect(bases.representation.alternating).toBe(0);
    bases.preset('30', 2);
    expect(bases.representation.encoded).toBe('11110');
    bases.base = 1;
    bases.update();
    expect(bases.error).not.toBe('');
    bases.preset('-255', 16);
    expect(bases.error).toBe('');
    expect(bases.representation.encoded).toBe('FF');
  });

  it('checks all supplied exercise answers and accepts alternate integer formatting', () => {
    const quiz = new SelfAssessmentComponent();
    quiz.questions = DIVISIBILITY_EXERCISES;
    for (const exercise of quiz.exercises.filter(
      (exercise) => exercise.answer !== undefined,
    )) {
      exercise.input = exercise.answer!;
      quiz.check(exercise);
      expect(exercise.feedback).toContain('Correcto');
    }
    const digit = quiz.exercises[3];
    digit.input = '5';
    quiz.check(digit);
    expect(digit.feedback).toContain('Todavía no');
    digit.input = '+002';
    quiz.check(digit);
    expect(digit.feedback).toContain('Correcto');
    expect(quiz.exercises.filter((exercise) => !exercise.answer).length).toBe(
      3,
    );
  });
});
