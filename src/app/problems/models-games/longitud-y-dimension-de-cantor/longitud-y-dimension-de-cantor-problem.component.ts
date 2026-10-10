import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-longitud-y-dimension-de-cantor-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './longitud-y-dimension-de-cantor-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LongitudYDimensionDeCantorProblemComponent {
  static readonly title = "Longitud y dimensión de Cantor";
  static readonly route = "problema-100";
  static readonly problem: PracticeProblem = {
    "id": "problema-100",
    "number": 100,
    "title": "Longitud y dimensión de Cantor",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Reto",
    "statement": "En el conjunto ternario de Cantor, calcula la longitud total restante tras n etapas, la longitud total eliminada en el límite y la dimensión de autosimilitud.",
    "resources": [
      {
        "label": "Conjunto de Cantor",
        "route": "/articles/cantor-set",
        "activity": "La construcción por etapas y la autosimilitud del conjunto ternario."
      }
    ]
  };
}
