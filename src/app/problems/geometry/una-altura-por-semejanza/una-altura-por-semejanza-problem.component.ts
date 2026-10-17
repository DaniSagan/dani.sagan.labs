import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-altura-por-semejanza-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-altura-por-semejanza-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaAlturaPorSemejanzaProblemComponent {
  static readonly title = "Una altura por semejanza";
  static readonly route = 'problema-121';
  static readonly problem: PracticeProblem = {
  "id": "problema-121",
  "number": 121,
  "title": "Una altura por semejanza",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Una vara vertical de 1,5 m proyecta una sombra de 2 m. Un árbol proyecta al mismo tiempo una sombra de 12 m sobre el mismo suelo horizontal. Halla su altura.",
  "resources": [
    {
      "label": "Semejanza de triángulos y proporcionalidad",
      "route": "/articles/triangle-similarity",
      "activity": "Practica una altura por semejanza. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
