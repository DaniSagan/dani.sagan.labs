import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-valor-medio-que-no-es-el-punto-medio-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-valor-medio-que-no-es-el-punto-medio-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnValorMedioQueNoEsElPuntoMedioProblemComponent {
  static readonly title = "Un valor medio que no es el punto medio";
  static readonly route = 'problema-168';
  static readonly problem: PracticeProblem = {
  "id": "problema-168",
  "number": 168,
  "title": "Un valor medio que no es el punto medio",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Calcula el valor medio de f(x)=x² en [0,3] y encuentra c con f(c) igual a ese promedio.",
  "resources": [
    {
      "label": "Teoremas de Rolle y del valor medio",
      "route": "/articles/mean-value-theorems",
      "activity": "Practica un valor medio que no es el punto medio. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
