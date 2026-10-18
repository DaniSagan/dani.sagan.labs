import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-collares-de-cuatro-cuentas-bajo-rotaciones-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './collares-de-cuatro-cuentas-bajo-rotaciones-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CollaresDeCuatroCuentasBajoRotacionesProblemComponent {
  static readonly title = "Collares de cuatro cuentas bajo rotaciones";
  static readonly route = "four-bead-necklaces-under-rotation";
  static readonly problem: PracticeProblem = {
  "id": "problema-196",
  "route": "four-bead-necklaces-under-rotation",
  "number": 196,
  "title": "Collares de cuatro cuentas bajo rotaciones",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Oposición",
  "statement": "Cada vértice de un cuadrado se colorea de blanco o negro. Cuenta los diseños distintos si solo identificamos rotaciones, sin identificar reflexiones.",
  "resources": [
    {
      "label": "Acciones de grupos y lema de Burnside",
      "route": "/articles/burnside-lemma",
      "activity": "Practica collares de cuatro cuentas bajo rotaciones. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Permutaciones, simetrías y orden",
      "route": "/articles/permutation-symmetries",
      "activity": "Distingue una transformación de sus iteraciones y busca cuándo vuelve la identidad."
    },
    {
      "label": "Principios de conteo y combinaciones",
      "route": "/articles/counting-principles",
      "activity": "Decide si importa el orden y si se permite repetir antes de usar una fórmula."
    }
  ]
};
}
