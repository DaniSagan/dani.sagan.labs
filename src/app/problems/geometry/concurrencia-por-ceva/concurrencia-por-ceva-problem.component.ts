import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-concurrencia-por-ceva-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './concurrencia-por-ceva-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ConcurrenciaPorCevaProblemComponent {
  static readonly title = "Concurrencia por Ceva";
  static readonly route = "problema-023";
  static readonly problem: PracticeProblem = {
    "id": "problema-023",
    "number": 23,
    "title": "Concurrencia por Ceva",
    "category": "Geometría",
    "topic": "Triángulos y áreas",
    "level": "Oposición",
    "statement": "En ABC, D∈BC, E∈CA, F∈AB son interiores. Si \\(BD/DC=2\\) y \\(CE/EA=3\\), determina \\(AF/FB\\) para que \\(AD,BE,CF\\) concurran.",
    "resources": [
      {
        "label": "Teorema de Ceva",
        "route": "/articles/ceva-theorem",
        "activity": "La condición de concurrencia expresada como producto de razones de segmentos."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
