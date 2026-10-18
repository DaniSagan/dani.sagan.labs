import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-esperanza-y-premio-justo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './esperanza-y-premio-justo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EsperanzaYPremioJustoProblemComponent {
  static readonly title = "Esperanza y premio justo";
  static readonly route = "expected-value-and-fair-prize";
  static readonly problem: PracticeProblem = {
  "id": "problema-079",
  "route": "expected-value-and-fair-prize",
  "number": 79,
  "title": "Esperanza y premio justo",
  "category": "Probabilidad",
  "topic": "Variables aleatorias",
  "level": "Oposición",
  "statement": "Un juego cuesta 4 € y paga, antes de descontar la entrada, 10 € si un dado da 6, 5 € si da 5 y 0 € en otro caso. Calcula la ganancia esperada y la entrada justa.",
  "resources": [
    {
      "label": "Esperanza discreta, juegos justos y riesgo",
      "route": "/articles/discrete-expectation",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Tablero de Galton",
      "route": "/articles/galton-board",
      "activity": "La distribución de resultados de una sucesión de decisiones aleatorias y su representación."
    },
    {
      "label": "Ley de los grandes números",
      "route": "/articles/large-numbers-law",
      "activity": "Relaciona promedios y frecuencias con convergencia, independencia y tamaño de muestra."
    },
    {
      "label": "Desigualdades de Markov y Chebyshev",
      "route": "/articles/probability-inequalities",
      "activity": "Obtén garantías de desviación desde media y varianza y compáralas con colas de distribuciones concretas."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    }
  ]
};
}
