import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-ruta-que-usa-cada-arista-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-ruta-que-usa-cada-arista-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRutaQueUsaCadaAristaProblemComponent {
  static readonly title = "Una ruta que usa cada arista";
  static readonly route = 'problema-195';
  static readonly problem: PracticeProblem = {
  "id": "problema-195",
  "number": 195,
  "title": "Una ruta que usa cada arista",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Un grafo tiene vértices A,B,C,D y aristas AB, BC, CD, DA y AC. Decide si existe un recorrido que use cada arista exactamente una vez y construye uno.",
  "resources": [
    {
      "label": "Recorridos eulerianos y caminos hamiltonianos",
      "route": "/articles/euler-hamilton",
      "activity": "Practica una ruta que usa cada arista. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
