import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-la-longitud-exacta-de-una-recta-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './la-longitud-exacta-de-una-recta-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LaLongitudExactaDeUnaRectaProblemComponent {
  static readonly title = "La longitud exacta de una recta";
  static readonly route = 'problema-167';
  static readonly problem: PracticeProblem = {
  "id": "problema-167",
  "number": 167,
  "title": "La longitud exacta de una recta",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Calcula mediante una integral la longitud de y=3x+1 entre x=0 y x=2 y compárala con la distancia entre extremos.",
  "resources": [
    {
      "label": "Longitud de arco y parametrización de curvas",
      "route": "/articles/arc-length",
      "activity": "Practica la longitud exacta de una recta. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
