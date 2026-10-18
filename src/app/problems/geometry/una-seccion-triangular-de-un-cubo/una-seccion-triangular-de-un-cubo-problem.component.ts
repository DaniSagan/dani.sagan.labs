import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-seccion-triangular-de-un-cubo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-seccion-triangular-de-un-cubo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSeccionTriangularDeUnCuboProblemComponent {
  static readonly title = "Una sección triangular de un cubo";
  static readonly route = "triangular-cross-section-of-a-cube";
  static readonly problem: PracticeProblem = {
  "id": "problema-128",
  "route": "triangular-cross-section-of-a-cube",
  "number": 128,
  "title": "Una sección triangular de un cubo",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "En un cubo de arista 2 considera A=(2,0,0), B=(0,2,0), C=(0,0,2). Calcula el perímetro y el área del triángulo ABC.",
  "resources": [
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Practica una sección triangular de un cubo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Rectas y planos del espacio",
      "route": "/articles/lines-planes",
      "activity": "Interpreta las ecuaciones y distingue paralelismo de intersección."
    },
    {
      "label": "Medianas, alturas, incentro y métricas del triángulo",
      "route": "/articles/triangle-metrics",
      "activity": "Distingue los segmentos y centros del triángulo y sus relaciones con el área."
    }
  ]
};
}
