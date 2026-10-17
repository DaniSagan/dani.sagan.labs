import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-contar-aristas-de-un-octaedro-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './contar-aristas-de-un-octaedro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ContarAristasDeUnOctaedroProblemComponent {
  static readonly title = "Contar aristas de un octaedro";
  static readonly route = 'problema-129';
  static readonly problem: PracticeProblem = {
  "id": "problema-129",
  "number": 129,
  "title": "Contar aristas de un octaedro",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "Un octaedro tiene ocho caras triangulares. Deduce cuántas aristas y vértices tiene.",
  "resources": [
    {
      "label": "Fórmula de Euler para poliedros",
      "route": "/articles/euler-polyhedron-formula",
      "activity": "Practica contar aristas de un octaedro. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
