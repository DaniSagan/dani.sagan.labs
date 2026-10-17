import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integral-impropia-que-si-converge-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integral-impropia-que-si-converge-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegralImpropiaQueSiConvergeProblemComponent {
  static readonly title = "Una integral impropia que sí converge";
  static readonly route = 'problema-165';
  static readonly problem: PracticeProblem = {
  "id": "problema-165",
  "number": 165,
  "title": "Una integral impropia que sí converge",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Calcula la integral de 1/x² desde 1 hasta infinito y la cola desde R hasta infinito, con R≥1.",
  "resources": [
    {
      "label": "Criterios de convergencia de series positivas",
      "route": "/articles/positive-series-tests",
      "activity": "Practica una integral impropia que sí converge. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
