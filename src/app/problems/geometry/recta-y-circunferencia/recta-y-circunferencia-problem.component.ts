import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-recta-y-circunferencia-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './recta-y-circunferencia-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RectaYCircunferenciaProblemComponent {
  static readonly title = "Recta y circunferencia";
  static readonly route = "problema-026";
  static readonly problem: PracticeProblem = {
    "id": "problema-026",
    "number": 26,
    "title": "Recta y circunferencia",
    "category": "Geometría",
    "topic": "Geometría analítica y espacio",
    "level": "Repaso",
    "statement": "Encuentra las intersecciones de \\(x^{2}+y^{2}=25\\) con \\(y=x+1\\).",
    "resources": [
      {
        "label": "Potencia de un punto",
        "route": "/articles/power-of-point",
        "activity": "Relaciones entre secantes y tangentes a una circunferencia."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
