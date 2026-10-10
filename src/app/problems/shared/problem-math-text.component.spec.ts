import { Directive, Input } from '@angular/core';
import { MathjaxModule } from 'mathjax-angular';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormulaComponent } from '../../shared/math/formula/formula.component';
import { ProblemMathTextComponent, problemTextParts } from './problem-math-text.component';

@Directive({ selector: '[mathjax]', standalone: true })
class MathjaxStubDirective { @Input() mathjax = ''; }

describe('Problem mathematical text', () => {
  it('keeps prose and TeX separate, including inequalities and matrix alignment', () => {
    const text = String.raw`Tomamos \(x<2\). La matriz es \(\begin{pmatrix}1&2\\3&4\end{pmatrix}\).`;
    const parts = problemTextParts(text);
    expect(parts.filter(part => part.kind === 'formula').map(part => part.value)).toEqual([
      'x<2', String.raw`\begin{pmatrix}1&2\\3&4\end{pmatrix}`
    ]);
    expect(parts.filter(part => part.kind === 'text').map(part => part.value).join('')).toBe('Tomamos . La matriz es .');
  });

  it('uses app-formula without code buttons and updates when the selected text changes', async () => {
    await TestBed.configureTestingModule({ imports: [ProblemMathTextComponent] })
      .overrideComponent(FormulaComponent, {
        remove: { imports: [MathjaxModule] },
        add: { imports: [MathjaxStubDirective] }
      }).compileComponents();
    const fixture = TestBed.createComponent(ProblemMathTextComponent);
    fixture.componentRef.setInput('text', String.raw`Resultado: \(\frac12\).`);
    fixture.detectChanges();
    const formula = fixture.debugElement.query(By.directive(FormulaComponent)).componentInstance as FormulaComponent;
    expect(formula.expression).toBe(String.raw`\frac12`);
    expect(formula.showCodeButton).toBeFalse();
    expect(fixture.nativeElement.querySelector('button')).toBeNull();
    fixture.componentRef.setInput('text', 'Una explicación sin ecuaciones.');
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.directive(FormulaComponent))).toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Una explicación sin ecuaciones.');
    fixture.destroy();
  });
});
