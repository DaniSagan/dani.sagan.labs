import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { CyclotomicRootsComponent } from '../../../widgets/cyclotomic/cyclotomic-roots.component';
import { CyclotomicFractalComponent } from '../../../widgets/cyclotomic/cyclotomic-fractal.component';
import { CyclotomicNewtonComponent } from '../../../widgets/cyclotomic/cyclotomic-newton.component';

@Component({
  selector: 'app-cyclotomic-polynomials-article', standalone: true,
  imports: [FormulaComponent, CyclotomicRootsComponent, CyclotomicFractalComponent, CyclotomicNewtonComponent],
  templateUrl: './cyclotomic-polynomials-article.component.html',
  styles: [':host { display: block; min-width: 0; } app-formula { display: block; max-width: 100%; overflow-x: auto; margin: 1rem 0; }']
})
export class CyclotomicPolynomialsArticleComponent {
  static title = 'Polinomios ciclotómicos y fractales de raíces';
  static route = 'cyclotomic-polynomials';
}
