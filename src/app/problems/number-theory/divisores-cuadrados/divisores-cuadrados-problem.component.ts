import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-divisores-cuadrados-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './divisores-cuadrados-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DivisoresCuadradosProblemComponent {
  static readonly title = "Divisores cuadrados";
  static readonly route = "problema-009";
  static readonly problem: PracticeProblem = {
    "id": "problema-009",
    "number": 9,
    "title": "Divisores cuadrados",
    "category": "Aritmética y teoría de números",
    "topic": "Diofánticas y demostraciones",
    "level": "Oposición",
    "statement": "¿Cuántos divisores positivos de 360 son cuadrados perfectos? Enuméralos.",
    "resources": [
      {
        "label": "Irracionalidad y valuaciones primas",
        "route": "/articles/prime-valuations",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Divisores y suma de divisores",
        "route": "/articles/divisor-sum-theorem",
        "activity": "El recuento de divisores mediante las elecciones de exponentes en la factorización prima."
      },
      {
        "label": "Descomposición en primos",
        "route": "/tools/prime-decomposition",
        "activity": "Factoriza 252, 198 y 360 para contrastar los ejercicios «Euclides y Bézout», «Divisores cuadrados»."
      },
      {
        "label": "Principios de conteo: suma, producto y elecciones",
        "route": "/articles/counting-principles",
        "activity": "Define si el orden importa y si se permite repetición antes de construir el espacio de elecciones."
      }
    ]
  };
}
