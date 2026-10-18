import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-centro-de-masas-de-tres-puntos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-centro-de-masas-de-tres-puntos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElCentroDeMasasDeTresPuntosProblemComponent {
  static readonly title = "El centro de masas de tres puntos";
  static readonly route = "centroid-of-three-points";
  static readonly problem: PracticeProblem = {
  "id": "problema-125",
  "route": "centroid-of-three-points",
  "number": 125,
  "title": "El centro de masas de tres puntos",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Sitúa masas 1, 2 y 3 en A=(0,0), B=(6,0) y C=(0,4). Encuentra su centro de masas.",
  "resources": [
    {
      "label": "Baricentro y centro de masas",
      "route": "/articles/barycenter",
      "activity": "Practica el centro de masas de tres puntos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Bases, independencia, núcleo e imagen",
      "route": "/articles/vector-spaces",
      "activity": "Distingue coordenadas, independencia y dimensiones de los espacios asociados."
    }
  ]
};
}
