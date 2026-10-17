import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-desigualdad-racional-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-desigualdad-racional-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDesigualdadRacionalProblemComponent {
  static readonly title = "Una desigualdad racional";
  static readonly route = 'problema-113';
  static readonly problem: PracticeProblem = {
  "id": "problema-113",
  "number": 113,
  "title": "Una desigualdad racional",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Resuelve (x−1)/(x+2)≥0 en los números reales.",
  "resources": [
    {
      "label": "Inecuaciones y tablas de signos",
      "route": "/articles/sign-charts",
      "activity": "Practica una desigualdad racional. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
