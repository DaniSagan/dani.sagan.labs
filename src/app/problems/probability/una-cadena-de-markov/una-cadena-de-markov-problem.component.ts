import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-cadena-de-markov-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-cadena-de-markov-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaCadenaDeMarkovProblemComponent {
  static readonly title = "Una cadena de Markov";
  static readonly route = "markov-chain";
  static readonly problem: PracticeProblem = {
  "id": "problema-080",
  "route": "markov-chain",
  "number": 80,
  "title": "Una cadena de Markov",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Reto",
  "statement": "Una máquina pasa de operativa a averiada con probabilidad \\(\\frac{1}{10}\\) por día y de averiada a operativa con probabilidad \\(\\frac{3}{5}\\). Halla la distribución estacionaria y la probabilidad de estar operativa dentro de dos días si hoy lo está.",
  "resources": [
    {
      "label": "Cadenas de Markov",
      "route": "/articles/markov-chains",
      "activity": "Estados, transiciones y evolución de distribuciones en procesos discretos."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
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
