import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-raiz-unica-sin-formula-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-raiz-unica-sin-formula-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRaizUnicaSinFormulaProblemComponent {
  static readonly title = "Una raíz única sin fórmula";
  static readonly route = "problema-050";
  static readonly problem: PracticeProblem = {
  "id": "problema-050",
  "number": 50,
  "title": "Una raíz única sin fórmula",
  "category": "Sucesiones, límites y continuidad",
  "topic": "Límites y continuidad",
  "level": "Oposición",
  "statement": "Demuestra que \\(x^{3}+x-1=0\\) tiene una única raíz real y que está entre \\(\\frac{1}{2}\\) y 1.",
  "resources": [
    {
      "label": "Teoremas de Rolle y del valor medio",
      "route": "/articles/mean-value-theorems",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema de Bolzano: existencia y unicidad de raíces",
      "route": "/articles/bolzano-theorem",
      "activity": "Separa existencia por Bolzano, unicidad por monotonía y aproximación certificada mediante bisección."
    },
    {
      "label": "Newton–Raphson",
      "route": "/articles/newton-raphson",
      "activity": "Búsqueda de raíces mediante rectas tangentes e iteraciones sucesivas."
    },
    {
      "label": "Representador de funciones",
      "route": "/tools/graph-plotter",
      "activity": "Representa las dos ramas del ejercicio «Continuidad y derivabilidad a trozos» por separado y observa el encuentro en x=1."
    },
    {
      "label": "Cómo demostrar: implicaciones, contradicción y contraposición",
      "route": "/articles/proof-strategies",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
