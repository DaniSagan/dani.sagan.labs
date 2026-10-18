import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-cuadrados-y-una-imposibilidad-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-cuadrados-y-una-imposibilidad-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosCuadradosYUnaImposibilidadProblemComponent {
  static readonly title = "Dos cuadrados y una imposibilidad";
  static readonly route = "impossible-sum-of-two-squares";
  static readonly problem: PracticeProblem = {
  "id": "problema-108",
  "route": "impossible-sum-of-two-squares",
  "number": 108,
  "title": "Dos cuadrados y una imposibilidad",
  "category": "Aritmética y teoría de números",
  "topic": "Diofánticas y demostraciones",
  "level": "Repaso",
  "statement": "Demuestra que ningún entero de la forma 4k+3 puede escribirse como suma de dos cuadrados de enteros.",
  "resources": [
    {
      "label": "Teorema de Fermat sobre dos cuadrados",
      "route": "/articles/sum-of-two-squares",
      "activity": "Practica dos cuadrados y una imposibilidad. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cómo demostrar: implicaciones, contradicción y contraposición",
      "route": "/articles/proof-strategies",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    },
    {
      "label": "Cuadrados y soluciones extrañas",
      "route": "/articles/equation-equivalence",
      "fragment": "squaring",
      "activity": "Controla los signos antes de cuadrar para que la transformación sea reversible."
    }
  ]
};
}
