import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-normal-a-partir-de-dos-direcciones-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-normal-a-partir-de-dos-direcciones-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaNormalAPartirDeDosDireccionesProblemComponent {
  static readonly title = "Una normal a partir de dos direcciones";
  static readonly route = "normal-from-two-directions";
  static readonly problem: PracticeProblem = {
  "id": "problema-127",
  "route": "normal-from-two-directions",
  "number": 127,
  "title": "Una normal a partir de dos direcciones",
  "category": "Geometría",
  "topic": "Geometría analítica y espacio",
  "level": "Repaso",
  "statement": "El plano pasa por el origen y contiene u=(1,0,1) y v=(0,1,1). Encuentra una ecuación del plano.",
  "resources": [
    {
      "label": "Producto vectorial",
      "route": "/articles/cross-product",
      "activity": "Practica una normal a partir de dos direcciones. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Vectores normales a un plano",
      "route": "/articles/plane-normal",
      "activity": "Obtén una dirección perpendicular al plano y úsala para proyectar."
    },
    {
      "label": "Producto escalar y perpendicularidad",
      "route": "/articles/dot-product",
      "activity": "Calcula productos escalares y comprueba ortogonalidad."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices o vectores del enunciado y contrasta productos, rangos y determinantes."
    }
  ]
};
}
