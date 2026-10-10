import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-recorrido-euleriano-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-recorrido-euleriano-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnRecorridoEulerianoProblemComponent {
  static readonly title = "Un recorrido euleriano";
  static readonly route = "problema-092";
  static readonly problem: PracticeProblem = {
    "id": "problema-092",
    "number": 92,
    "title": "Un recorrido euleriano",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Conteo, grafos y estrategias",
    "level": "Oposición",
    "statement": "Un grafo tiene vértices \\(A,B,C,D\\) y aristas \\(AB,BC,CD,DA,AC\\). Decide si admite circuito euleriano o recorrido euleriano abierto, y da uno si existe.",
    "resources": [
      {
        "label": "Puentes de Königsberg",
        "route": "/articles/konigsberg-bridges",
        "activity": "Grados de vértices y condiciones de existencia de recorridos eulerianos."
      }
    ]
  };
}
