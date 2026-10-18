import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-cambiar-de-puerta-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './cambiar-de-puerta-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CambiarDePuertaProblemComponent {
  static readonly title = "Cambiar de puerta";
  static readonly route = "monty-hall-switching";
  static readonly problem: PracticeProblem = {
  "id": "problema-075",
  "route": "monty-hall-switching",
  "number": 75,
  "title": "Cambiar de puerta",
  "category": "Probabilidad",
  "topic": "Conteo y probabilidad condicionada",
  "level": "Oposición",
  "statement": "En Monty Hall hay 3 puertas y un premio uniforme. El presentador conoce el premio, siempre abre una puerta vacía distinta de la elegida y siempre permite cambiar. Calcula la probabilidad de ganar cambiando.",
  "resources": [
    {
      "label": "Problema de Monty Hall",
      "route": "/articles/monty-hall",
      "activity": "La influencia del protocolo del presentador en la probabilidad de ganar."
    },
    {
      "label": "Probabilidad condicionada e independencia",
      "route": "/articles/conditional-independence",
      "activity": "Distingue restringir el espacio de resultados, multiplicar probabilidades y sumar casos disjuntos."
    },
    {
      "label": "Espacio muestral, sucesos y complemento",
      "route": "/articles/finite-probability",
      "activity": "Cuenta solo resultados equiprobables y distingue unión, intersección y complemento."
    }
  ]
};
}
