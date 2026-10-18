import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-coordenadas-en-una-base-oblicua-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './coordenadas-en-una-base-oblicua-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CoordenadasEnUnaBaseOblicuaProblemComponent {
  static readonly title = "Coordenadas en una base oblicua";
  static readonly route = "coordinates-in-an-oblique-basis";
  static readonly problem: PracticeProblem = {
  "id": "problema-116",
  "route": "coordinates-in-an-oblique-basis",
  "number": 116,
  "title": "Coordenadas en una base oblicua",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Repaso",
  "statement": "Expresa v=(5,1) en la base u=(1,1), w=(1,−1). Explica la diferencia entre coordenadas y componentes habituales.",
  "resources": [
    {
      "label": "Espacios vectoriales, bases y rango–nulidad",
      "route": "/articles/vector-spaces",
      "activity": "Practica coordenadas en una base oblicua. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cambios de base y matrices de una transformación",
      "route": "/articles/change-of-basis",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Eliminación de Gauss y sistemas compatibles",
      "route": "/articles/gaussian-elimination",
      "activity": "Entiende qué operaciones conservan las soluciones de un sistema."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices o vectores del enunciado y contrasta productos, rangos y determinantes."
    }
  ]
};
}
