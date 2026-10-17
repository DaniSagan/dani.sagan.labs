import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-inverso-para-descifrar-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-inverso-para-descifrar-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnInversoParaDescifrarProblemComponent {
  static readonly title = "Un inverso para descifrar";
  static readonly route = 'problema-103';
  static readonly problem: PracticeProblem = {
  "id": "problema-103",
  "number": 103,
  "title": "Un inverso para descifrar",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Repaso",
  "statement": "Encuentra el inverso de 7 módulo 26 y resuelve 7x≡9 (módulo 26).",
  "resources": [
    {
      "label": "Identidad de Bézout",
      "route": "/articles/bezout-identity",
      "activity": "Practica un inverso para descifrar. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
