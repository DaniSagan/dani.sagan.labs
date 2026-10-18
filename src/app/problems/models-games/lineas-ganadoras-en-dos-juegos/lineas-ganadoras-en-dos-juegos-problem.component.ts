import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-lineas-ganadoras-en-dos-juegos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './lineas-ganadoras-en-dos-juegos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LineasGanadorasEnDosJuegosProblemComponent {
  static readonly title = "Líneas ganadoras en dos juegos";
  static readonly route = "winning-lines-in-two-games";
  static readonly problem: PracticeProblem = {
  "id": "problema-093",
  "route": "winning-lines-in-two-games",
  "number": 93,
  "title": "Líneas ganadoras en dos juegos",
  "category": "Combinatoria, juegos y modelización",
  "topic": "Conteo, grafos y estrategias",
  "level": "Repaso",
  "statement": "Cuenta las líneas ganadoras de tres en raya en un tablero 3×3 y los segmentos de cuatro casillas consecutivas en un tablero de cuatro en raya de 6 filas y 7 columnas.",
  "resources": [
    {
      "label": "Conteo sistemático en tableros y cuadrículas",
      "route": "/articles/grid-counting",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Teorema del binomio",
      "route": "/articles/binomial-theorem",
      "activity": "El principio de conteo del ejercicio se puede comparar con el recuento de elecciones que origina los coeficientes binomiales."
    },
    {
      "label": "Tres en raya",
      "route": "/games/tic-tac-toe",
      "activity": "Comprueba en el tablero las dos clases de líneas del ejercicio «Líneas ganadoras en dos juegos»."
    },
    {
      "label": "Cuatro en raya",
      "route": "/games/four-in-a-row",
      "activity": "Localiza ejemplos de las líneas horizontales, verticales y diagonales contadas en el ejercicio «Líneas ganadoras en dos juegos»."
    },
    {
      "label": "Principios de conteo: suma, producto y elecciones",
      "route": "/articles/counting-principles",
      "activity": "Define si el orden importa y si se permite repetición antes de construir el espacio de elecciones."
    },
    {
      "label": "Acciones de grupos y lema de Burnside",
      "route": "/articles/burnside-lemma",
      "activity": "Cuenta clases de configuraciones bajo simetrías mediante órbitas, estabilizadores y puntos fijos."
    }
  ]
};
}
