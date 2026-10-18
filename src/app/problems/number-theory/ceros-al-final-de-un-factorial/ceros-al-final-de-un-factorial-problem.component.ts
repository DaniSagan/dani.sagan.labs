import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-ceros-al-final-de-un-factorial-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './ceros-al-final-de-un-factorial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class CerosAlFinalDeUnFactorialProblemComponent {
  static readonly title = "Ceros al final de un factorial";
  static readonly route = "factorial-trailing-zeros";
  static readonly problem: PracticeProblem = {
  "id": "problema-102",
  "route": "factorial-trailing-zeros",
  "number": 102,
  "title": "Ceros al final de un factorial",
  "category": "Aritmética y teoría de números",
  "topic": "Divisibilidad y congruencias",
  "level": "Repaso",
  "statement": "¿Cuántos ceros tiene al final 25! en base diez? Justifica cómo cuentas los factores.",
  "resources": [
    {
      "label": "Irracionalidad y valuaciones primas",
      "route": "/articles/prime-valuations",
      "activity": "Practica ceros al final de un factorial. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Factoriales, exponentes primos y fórmula de Legendre",
      "route": "/articles/factorials-legendre",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Factorización prima y divisores",
      "route": "/articles/fundamental-theorem-arithmetic",
      "activity": "Usa la unicidad de la factorización para contar divisores y demostrar imposibilidades."
    },
    {
      "label": "Descomposición en primos",
      "route": "/tools/prime-decomposition",
      "activity": "Descompón los enteros del problema y contrasta sus exponentes y divisores."
    }
  ]
};
}
