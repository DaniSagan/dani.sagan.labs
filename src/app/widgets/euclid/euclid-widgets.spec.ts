import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { EuclidExplorerComponent } from './euclid-explorer.component';
import { EuclidExercisesComponent } from './euclid-exercises.component';
import { GcdInvarianceComponent } from './gcd-invariance.component';

describe('Euclid explorer controls', () => {
  it('steps forward and backward, resets substitutions, and clamps endpoints', () => {
    const widget = new EuclidExplorerComponent();
    widget.move(1);
    expect(widget.current?.remainder).toBe(54n);
    expect(widget.visibleRows.length).toBe(3);
    widget.move(100);
    expect(widget.complete).toBeTrue();
    widget.backStep = 2;
    widget.move(-1);
    expect(widget.complete).toBeFalse();
    expect(widget.backStep).toBe(0);
    widget.move(-100);
    expect(widget.step).toBe(0);
  });

  it('plays to completion, pauses, resets on input changes, and cleans up on destroy', fakeAsync(() => {
    const widget = new EuclidExplorerComponent();
    widget.toggle(); tick(1200);
    expect(widget.step).toBe(1);
    widget.toggle(); tick(2400);
    expect(widget.step).toBe(1);
    widget.toggle(); tick(3600);
    expect(widget.complete).toBeTrue();
    expect(widget.playing).toBeFalse();
    widget.restart(); widget.toggle();
    widget.preset('-84', '30'); tick(2400);
    expect(widget.step).toBe(0);
    expect(widget.result.gcd).toBe(6n);
    widget.toggle(); widget.ngOnDestroy(); tick(2400);
    expect(widget.step).toBe(0);
    expect(widget.playing).toBeFalse();
  }));

  it('hides stale results for invalid input and recovers after correction', async () => {
    await TestBed.configureTestingModule({ imports: [EuclidExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(EuclidExplorerComponent);
    fixture.detectChanges();
    const widget = fixture.componentInstance;
    widget.aText = '1.2'; widget.update(); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain('enteros');
    expect(fixture.nativeElement.querySelector('.transport')).toBeNull();
    widget.preset('0', '0'); fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="alert"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.result').textContent).toContain('0');
    expect(fixture.nativeElement.textContent).toContain('no hay un mayor divisor común positivo');
    fixture.destroy();
  });

  it('preserves the entire divisor set under the allowed shifts', () => {
    const widget = new GcdInvarianceComponent();
    for (const a of [1, 18, 48, 120]) {
      for (const b of [1, 18, 48, 120]) {
        for (let k = -5; k <= 5; k++) {
          widget.a = a; widget.b = b; widget.k = k;
          expect(widget.common(widget.shifted, b)).toEqual(widget.common(a, b));
        }
      }
    }
    widget.a = 1.5;
    expect(widget.valid).toBeFalse();
  });

  it('checks exercise answers without treating blanks or decimals as integers', () => {
    const widget = new EuclidExercisesComponent();
    const exercise = widget.exercises[0];
    widget.check(exercise);
    expect(exercise.feedback).toContain('Escribe');
    exercise.input = '2.0'; widget.check(exercise);
    expect(exercise.feedback).toContain('Todavía no');
    exercise.input = '+002'; widget.check(exercise);
    expect(exercise.feedback).toContain('Correcto');
    for (const choice of widget.exercises.filter(e => e.choices)) {
      choice.input = choice.answer!; widget.check(choice);
      expect(choice.feedback).toContain('Correcto');
    }
  });

  it('reveals hints progressively before the reasoned solution', async () => {
    await TestBed.configureTestingModule({ imports: [EuclidExercisesComponent] }).compileComponents();
    const fixture = TestBed.createComponent(EuclidExercisesComponent);
    fixture.detectChanges();
    const first = fixture.nativeElement.querySelector('.exercise');
    const buttons: HTMLButtonElement[] = Array.from(first.querySelectorAll('button'));
    const hint = buttons.find(b => b.textContent?.includes('Pista'))!;
    const solution = buttons.find(b => b.textContent?.includes('Revelar'))!;
    expect(solution.disabled).toBeTrue();
    hint.click(); fixture.detectChanges();
    expect(first.textContent).toContain('Empieza con 414');
    expect(solution.disabled).toBeTrue();
    hint.click(); fixture.detectChanges();
    expect(solution.disabled).toBeFalse();
    solution.click(); fixture.detectChanges();
    expect(first.querySelector('.result').textContent).toContain('El último resto no nulo es 2');
    fixture.destroy();
  });
});
