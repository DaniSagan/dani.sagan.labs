import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-trapecios-para-una-funcion-convexa-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './trapecios-para-una-funcion-convexa-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TrapeciosParaUnaFuncionConvexaProblemComponent {
  static readonly title = "Trapecios para una función convexa";
  static readonly route = 'problema-169';
  static readonly problem: PracticeProblem = {
  "id": "problema-169",
  "number": 169,
  "title": "Trapecios para una función convexa",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Repaso",
  "statement": "Aproxima la integral de x² entre 0 y 2 con dos trapecios de igual anchura y compara con el valor exacto.",
  "resources": [
    {
      "label": "Convexidad, concavidad y desigualdades",
      "route": "/articles/convexity-tangents",
      "activity": "Practica trapecios para una función convexa. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
