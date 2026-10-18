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
  static readonly route = "ceva-concurrency";
  static readonly problem: PracticeProblem = {
  "id": "problema-023",
  "route": "ceva-concurrency",
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
      "label": "Medianas, alturas, incentro y métricas del triángulo",
      "route": "/articles/triangle-metrics",
      "activity": "Distingue los segmentos y centros del triángulo y sus relaciones con el área."
    },
    {
      "label": "Semejanza de triángulos",
      "route": "/articles/triangle-similarity",
      "activity": "Usa la misma razón para lados correspondientes, no para áreas."
    }
  ]
};
}
