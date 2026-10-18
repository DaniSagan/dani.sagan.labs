import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-derivada-desde-su-definicion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-derivada-desde-su-definicion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDerivadaDesdeSuDefinicionProblemComponent {
  static readonly title = "Una derivada desde su definición";
  static readonly route = "derivative-from-definition";
  static readonly problem: PracticeProblem = {
  "id": "problema-151",
  "route": "derivative-from-definition",
  "number": 151,
  "title": "Una derivada desde su definición",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Calcula la derivada de f(x)=x²+3x usando el cociente incremental, sin aplicar una tabla de derivadas.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Practica una derivada desde su definición. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    }
  ]
};
}
