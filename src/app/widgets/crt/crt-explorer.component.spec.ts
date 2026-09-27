import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { CrtExplorerComponent } from './crt-explorer.component';
import { CRT_EXERCISES } from '../../articles/number-theory/chinese-remainder-theorem/crt-exercises';
import { SelfAssessmentComponent } from '../self-assessment/self-assessment.component';

describe('CRT explorer', () => {
  it('bounds row editing, resets the trace and hides invalid results', async () => {
    await TestBed.configureTestingModule({
      imports: [CrtExplorerComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(CrtExplorerComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    c.jump();
    expect(c.cursor).toBe(8n);
    for (let i = 0; i < 8; i++) c.add();
    expect(c.rows.length).toBe(6);
    for (let i = 0; i < 8; i++) c.remove(0);
    expect(c.rows.length).toBe(2);
    c.rows[0].modulus = '0';
    c.update();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role=alert]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('.result')).toBeNull();
    c.preset(1);
    fixture.detectChanges();
    expect(c.result.solution?.residue).toBe(23n);
    expect(c.cursor).toBe(0n);
    c.moveStep(99);
    expect(c.step).toBe(1);
    c.moveStep(-99);
    expect(c.step).toBe(0);
    fixture.destroy();
  });
  it('supports exact negative positions and skips oversized clocks', () => {
    const c = new CrtExplorerComponent();
    c.move(-7);
    expect(c.common(0)).toBeTrue();
    expect(c.residue(0)).toBe(2);
    c.rows[0].modulus = '100';
    c.update();
    expect(c.clocksVisible).toBeFalse();
    c.preset(3);
    expect(c.coincidences).toBe('');
    c.preset(5);
    expect(c.ticks(1n)).toEqual([0]);
  });
  it('stops playback on a solution, input change, timeout and destruction', fakeAsync(() => {
    const c = new CrtExplorerComponent();
    c.play();
    tick(4000);
    expect(c.cursor).toBe(8n);
    expect(c.playing).toBeFalse();
    c.play();
    c.update();
    tick(1000);
    expect(c.cursor).toBe(0n);
    expect(c.playing).toBeFalse();
    c.preset(3);
    c.play();
    tick(100000);
    expect(c.cursor).toBe(200n);
    expect(c.playing).toBeFalse();
    c.play();
    c.ngOnDestroy();
    tick(500);
    expect(c.cursor).toBe(200n);
  }));
  it('supplies progressive hints and correctly checkable exercise answers', () => {
    const quiz = new SelfAssessmentComponent();
    quiz.questions = CRT_EXERCISES;
    expect(quiz.exercises.length).toBe(12);
    for (const exercise of quiz.exercises) {
      expect(exercise.hints.length).toBe(3);
      if (exercise.answer) {
        exercise.input = exercise.answer;
        quiz.check(exercise);
        expect(exercise.feedback).toContain('Correcto');
      }
    }
  });
});
