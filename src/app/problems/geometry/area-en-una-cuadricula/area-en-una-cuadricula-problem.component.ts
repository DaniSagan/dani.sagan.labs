import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-area-en-una-cuadricula-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './area-en-una-cuadricula-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AreaEnUnaCuadriculaProblemComponent {
  static readonly title = "Área en una cuadrícula";
  static readonly route = "problema-025";
  static readonly problem: PracticeProblem = {
    "id": "problema-025",
    "number": 25,
    "title": "Área en una cuadrícula",
    "category": "Geometría",
    "topic": "Triángulos y áreas",
    "level": "Oposición",
    "statement": "Calcula el área del polígono de vértices \\((0,0),(4,0),(4,3),(0,1)\\) y sus cantidades de puntos de borde e interiores.",
    "resources": [
      {
        "label": "Teorema de Pick",
        "route": "/articles/pick-theorem",
        "activity": "La relación entre área, puntos interiores y puntos de borde de un polígono reticular."
      },
      {
        "label": "Fórmula del cordón",
        "route": "/articles/shoelace-formula",
        "activity": "El cálculo de áreas mediante sumas cruzadas de coordenadas ordenadas."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
