import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-simetria-del-sudoku-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-simetria-del-sudoku-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaSimetriaDelSudokuProblemComponent {
  static readonly title = "Una simetría del sudoku";
  static readonly route = "problema-094";
  static readonly problem: PracticeProblem = {
    "id": "problema-094",
    "number": 94,
    "title": "Una simetría del sudoku",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Conteo, grafos y estrategias",
    "level": "Oposición",
    "statement": "En un sudoku 9×9 resuelto, intercambia globalmente los símbolos 1 y 9. Demuestra que el resultado sigue siendo válido. ¿Qué ocurre si solo cambias una casilla con 1 por 9?",
    "resources": [
      {
        "label": "Teorema de los cuatro colores",
        "route": "/articles/four-color-theorem",
        "activity": "Un sudoku se puede modelar como un grafo de incompatibilidades entre casillas. Renombrar globalmente sus colores conserva las restricciones, aunque el teorema de cuatro colores no sea un resultado sobre sudokus."
      },
      {
        "label": "Sudoku",
        "route": "/games/sudoku",
        "activity": "Aplica el argumento de invariancia del ejercicio «Una simetría del sudoku» a un tablero completo."
      }
    ]
  };
}
