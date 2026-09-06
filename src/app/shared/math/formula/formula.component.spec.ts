import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MathjaxModule } from 'mathjax-angular';
import { FormulaComponent } from './formula.component';

@Directive({ selector: '[mathjax]', standalone: true })
class MathjaxStubDirective {
  @Input() mathjax = '';
}

describe('FormulaComponent', () => {
  let fixture: ComponentFixture<FormulaComponent>;
  let previousMathJax: any;

  beforeEach(async () => {
    previousMathJax = (window as any).MathJax;
    (window as any).MathJax = { isReady: false };
    await TestBed.configureTestingModule({ imports: [FormulaComponent] })
      .overrideComponent(FormulaComponent, {
        remove: { imports: [MathjaxModule] },
        add: { imports: [MathjaxStubDirective] }
      }).compileComponents();
    fixture = TestBed.createComponent(FormulaComponent);
    fixture.componentRef.setInput('expression', 'a^2+b^2=c^2');
  });

  afterEach(() => {
    fixture.destroy();
    (window as any).MathJax = previousMathJax;
  });

  it('keeps the expression visible until MathJax is ready, then creates the directive', fakeAsync(() => {
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('a^2+b^2=c^2');
    expect(fixture.debugElement.query(By.directive(MathjaxStubDirective))).toBeNull();
    (window as any).MathJax = { isReady: true, typesetPromise: () => Promise.resolve() };
    tick(50);
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(MathjaxStubDirective));
    expect(directive).not.toBeNull();
    expect(directive.injector.get(MathjaxStubDirective).mathjax).toBe('$$ a^2+b^2=c^2 $$');
  }));

  it('renders immediately when ready and forwards later expression changes', () => {
    (window as any).MathJax = { isReady: true, typesetPromise: () => Promise.resolve() };
    fixture.detectChanges();
    fixture.componentRef.setInput('expression', 'K=rs');
    fixture.componentRef.setInput('displayMode', 'inline');
    fixture.detectChanges();
    const directive = fixture.debugElement.query(By.directive(MathjaxStubDirective));
    expect(directive.injector.get(MathjaxStubDirective).mathjax).toBe('$ K=rs $');
  });

  it('cancels the readiness check when the article is destroyed', fakeAsync(() => {
    fixture.detectChanges();
    fixture.destroy();
    (window as any).MathJax = { isReady: true, typesetPromise: () => Promise.resolve() };
    tick(100);
    expect(fixture.componentInstance.isMathJaxReady).toBeFalse();
  }));
});
