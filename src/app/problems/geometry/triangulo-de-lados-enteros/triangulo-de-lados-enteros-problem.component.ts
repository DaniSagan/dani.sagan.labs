import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-triangulo-de-lados-enteros-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './triangulo-de-lados-enteros-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TrianguloDeLadosEnterosProblemComponent {
  static readonly title = "Triángulo de lados enteros";
  static readonly route = "problema-021";
  static readonly problem: PracticeProblem = {
    "id": "problema-021",
    "number": 21,
    "title": "Triángulo de lados enteros",
    "category": "Geometría",
    "topic": "Triángulos y áreas",
    "level": "Repaso",
    "statement": "Calcula el área, el inradio y la altura sobre el lado 14 de un triángulo de lados \\(13,14,15\\).",
    "resources": [
      {
        "label": "Fórmula de Herón",
        "route": "/articles/heron-formula",
        "activity": "El cálculo del área de un triángulo a partir de sus tres lados."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
