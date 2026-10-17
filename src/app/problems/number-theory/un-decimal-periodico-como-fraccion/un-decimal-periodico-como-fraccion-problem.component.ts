import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-decimal-periodico-como-fraccion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-decimal-periodico-como-fraccion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnDecimalPeriodicoComoFraccionProblemComponent {
  static readonly title = "Un decimal periódico como fracción";
  static readonly route = 'problema-107';
  static readonly problem: PracticeProblem = {
  "id": "problema-107",
  "number": 107,
  "title": "Un decimal periódico como fracción",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Repaso",
  "statement": "Convierte 0,272727… en una fracción irreducible y explica por qué el procedimiento es exacto.",
  "resources": [
    {
      "label": "Progresiones y series geométricas",
      "route": "/articles/geometric-series",
      "activity": "Practica un decimal periódico como fracción. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
