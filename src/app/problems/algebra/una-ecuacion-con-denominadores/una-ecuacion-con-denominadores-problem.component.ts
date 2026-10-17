import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-ecuacion-con-denominadores-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-ecuacion-con-denominadores-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaEcuacionConDenominadoresProblemComponent {
  static readonly title = "Una ecuación con denominadores";
  static readonly route = 'problema-111';
  static readonly problem: PracticeProblem = {
  "id": "problema-111",
  "number": 111,
  "title": "Una ecuación con denominadores",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Resuelve (x+1)/(x−2)=3 e indica qué valor está prohibido.",
  "resources": [
    {
      "label": "Inecuaciones y tablas de signos",
      "route": "/articles/sign-charts",
      "activity": "Practica una ecuación con denominadores. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Identidades algebraicas y técnicas de factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
