import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-completar-un-cuadrado-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './completar-un-cuadrado-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CompletarUnCuadradoProblemComponent {
  static readonly title = "Completar un cuadrado";
  static readonly route = "completing-the-square";
  static readonly problem: PracticeProblem = {
  "id": "problema-114",
  "route": "completing-the-square",
  "number": 114,
  "title": "Completar un cuadrado",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Encuentra el mínimo de x²−6x+13 y los valores de x para los que vale 8.",
  "resources": [
    {
      "label": "Ecuaciones cuadráticas: discriminante y Viète",
      "route": "/articles/quadratic-equations",
      "activity": "Practica completar un cuadrado. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades algebraicas y técnicas de factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Extremos globales y teorema de Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
