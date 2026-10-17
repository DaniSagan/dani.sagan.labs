import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-racionalizar-cerca-de-cero-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './racionalizar-cerca-de-cero-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class RacionalizarCercaDeCeroProblemComponent {
  static readonly title = "Racionalizar cerca de cero";
  static readonly route = 'problema-146';
  static readonly problem: PracticeProblem = {
  "id": "problema-146",
  "number": 146,
  "title": "Racionalizar cerca de cero",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Repaso",
  "statement": "Calcula el límite de (√(1+x)−1)/x cuando x tiende a cero.",
  "resources": [
    {
      "label": "Límites, equivalencias y jerarquías de crecimiento",
      "route": "/articles/asymptotic-limits",
      "activity": "Practica racionalizar cerca de cero. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades algebraicas y técnicas de factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
