import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-limite-por-grados-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-limite-por-grados-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnLimitePorGradosProblemComponent {
  static readonly title = "Un límite por grados";
  static readonly route = 'problema-142';
  static readonly problem: PracticeProblem = {
  "id": "problema-142",
  "number": 142,
  "title": "Un límite por grados",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Sucesiones y series",
  "level": "Repaso",
  "statement": "Calcula el límite de (3n²−n+4)/(2n²+5) cuando n tiende a infinito.",
  "resources": [
    {
      "label": "Límites, equivalencias y jerarquías de crecimiento",
      "route": "/articles/asymptotic-limits",
      "activity": "Practica un límite por grados. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
