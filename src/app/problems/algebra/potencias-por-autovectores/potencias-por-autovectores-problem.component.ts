import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-potencias-por-autovectores-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './potencias-por-autovectores-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class PotenciasPorAutovectoresProblemComponent {
  static readonly title = "Potencias por autovectores";
  static readonly route = "matrix-powers-using-eigenvectors";
  static readonly problem: PracticeProblem = {
  "id": "problema-017",
  "route": "matrix-powers-using-eigenvectors",
  "number": 17,
  "title": "Potencias por autovectores",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Reto",
  "statement": "Sea \\(A=\\begin{pmatrix}2&1\\\\1&2\\end{pmatrix}\\). Calcula \\(A^{n}\\) para todo entero \\(n\\ge 0\\).",
  "resources": [
    {
      "label": "Sistemas diferenciales lineales y exponencial de matrices",
      "route": "/articles/linear-ode-systems",
      "activity": "Conecta autovectores y Jordan con el flujo continuo; deriva la exponencial de la matriz y verifica el dato inicial."
    },
    {
      "label": "Forma de Jordan, nilpotencia y potencias de matrices",
      "route": "/articles/jordan-form",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema de Cayley–Hamilton y polinomio mínimo",
      "route": "/articles/cayley-hamilton",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Diagonalización de matrices",
      "route": "/articles/matrix-diagonalization",
      "activity": "Autovalores, bases de autovectores y cálculo de potencias de una matriz."
    },
    {
      "label": "Laboratorio de álgebra lineal",
      "route": "/tools/linear-algebra",
      "activity": "Introduce las matrices de los ejercicios «Sistema con parámetro», «Potencias por autovectores», «Un determinante geométrico», «Proyección ortogonal», «Una matriz no diagonalizable» y comprueba rangos, productos y determinantes."
    },
    {
      "label": "Inducción matemática y construcción de pruebas",
      "route": "/articles/mathematical-induction",
      "activity": "Demuestra la identidad o la estructura de todas las etapas, separando caso inicial y paso inductivo."
    },
    {
      "label": "Cambios de base y matrices de una transformación",
      "route": "/articles/change-of-basis",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Bases, independencia, núcleo e imagen",
      "route": "/articles/vector-spaces",
      "activity": "Distingue coordenadas, independencia y dimensiones de los espacios asociados."
    }
  ]
};
}
