import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-triangulo-con-angulo-conocido-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-triangulo-con-angulo-conocido-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnTrianguloConAnguloConocidoProblemComponent {
  static readonly title = "Un triángulo con ángulo conocido";
  static readonly route = "triangle-with-known-angle";
  static readonly problem: PracticeProblem = {
  "id": "problema-035",
  "route": "triangle-with-known-angle",
  "number": 35,
  "title": "Un triángulo con ángulo conocido",
  "category": "Trigonometría y números complejos",
  "topic": "Identidades y ecuaciones",
  "level": "Repaso",
  "statement": "Dos lados de un triángulo miden 5 y 7 y forman 60°. Calcula el tercer lado y el área.",
  "resources": [
    {
      "label": "Geometría del triángulo: radios, alturas y medianas",
      "route": "/articles/triangle-metrics",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Trigonometría para medir alturas y distancias",
      "route": "/articles/height-surveying",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema del coseno",
      "route": "/articles/law-of-cosines",
      "activity": "La relación entre dos lados, el ángulo comprendido y el tercer lado."
    },
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
    },
    {
      "label": "Semejanza de triángulos y proporcionalidad",
      "route": "/articles/triangle-similarity",
      "activity": "Identifica triángulos correspondientes y deduce razones de longitud, área y medidas indirectas."
    },
    {
      "label": "Ley de los senos y caso ambiguo",
      "route": "/articles/sine-law",
      "activity": "Amplía la resolución triangular con la ley de los senos y comprueba todas las ramas del caso ambiguo."
    },
    {
      "label": "Razones e identidades trigonométricas",
      "route": "/articles/trig-n-functions",
      "activity": "Relaciona ángulos y coordenadas y justifica las identidades utilizadas."
    }
  ]
};
}
