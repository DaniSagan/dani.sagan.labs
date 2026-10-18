import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-vectores-ortonormales-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-vectores-ortonormales-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosVectoresOrtonormalesProblemComponent {
  static readonly title = "Dos vectores ortonormales";
  static readonly route = "orthonormal-vector-pair";
  static readonly problem: PracticeProblem = {
  "id": "problema-118",
  "route": "orthonormal-vector-pair",
  "number": 118,
  "title": "Dos vectores ortonormales",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Oposición",
  "statement": "Aplica Gram–Schmidt a u=(1,1,0) y v=(1,0,1), y da una base ortonormal del plano que generan.",
  "resources": [
    {
      "label": "Productos internos y ortonormalización de Gram–Schmidt",
      "route": "/articles/gram-schmidt",
      "activity": "Practica dos vectores ortonormales. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Cambios de base y matrices de una transformación",
      "route": "/articles/change-of-basis",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Producto escalar y perpendicularidad",
      "route": "/articles/dot-product",
      "activity": "Calcula productos escalares y comprueba ortogonalidad."
    },
    {
      "label": "Norma y distancia euclídea",
      "route": "/articles/vector-norm",
      "activity": "Distingue un vector de su longitud y calcula distancias."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices o vectores del enunciado y contrasta productos, rangos y determinantes."
    }
  ]
};
}
