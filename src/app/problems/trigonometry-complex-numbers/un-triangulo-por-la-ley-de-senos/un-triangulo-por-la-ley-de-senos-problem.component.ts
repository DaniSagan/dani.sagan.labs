import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-triangulo-por-la-ley-de-senos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-triangulo-por-la-ley-de-senos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnTrianguloPorLaLeyDeSenosProblemComponent {
  static readonly title = "Un triángulo por la ley de senos";
  static readonly route = 'problema-135';
  static readonly problem: PracticeProblem = {
  "id": "problema-135",
  "number": 135,
  "title": "Un triángulo por la ley de senos",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "En un triángulo A=30°, B=45° y el lado opuesto a A mide 6. Halla C y el lado opuesto a B.",
  "resources": [
    {
      "label": "Ley de los senos y caso ambiguo",
      "route": "/articles/sine-law",
      "activity": "Practica un triángulo por la ley de senos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
