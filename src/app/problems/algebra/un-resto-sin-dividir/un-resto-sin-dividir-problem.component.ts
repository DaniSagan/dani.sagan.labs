import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-un-resto-sin-dividir-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './un-resto-sin-dividir-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnRestoSinDividirProblemComponent {
  static readonly title = "Un resto sin dividir";
  static readonly route = "polynomial-remainder-theorem";
  static readonly problem: PracticeProblem = {
  "id": "problema-013",
  "route": "polynomial-remainder-theorem",
  "number": 13,
  "title": "Un resto sin dividir",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Halla el resto de dividir \\(x^{2026}+3x+1\\) entre \\(x^{2}-1\\).",
  "resources": [
    {
      "label": "División de polinomios y teorema del resto",
      "route": "/articles/polynomial-division",
      "activity": "Obtén el resto mediante las raíces del divisor y comprueba la identidad P = DQ + R sin expandir potencias enormes."
    },
    {
      "label": "Polinomios ciclotómicos",
      "route": "/articles/cyclotomic-polynomials",
      "activity": "Factorizaciones de potencias menos uno y raíces de la unidad en el plano complejo."
    },
    {
      "label": "Interpolación de Lagrange y Hermite",
      "route": "/articles/polynomial-interpolation",
      "activity": "Amplía el uso de valores y derivadas para reconstruir un polinomio y controlar su error."
    },
    {
      "label": "Grado, términos y coeficientes de un polinomio",
      "route": "/articles/polynomial-foundations",
      "fragment": "coefficients",
      "activity": "Identifica los coeficientes, incluye términos ausentes y determina el grado después de simplificar."
    },
    {
      "label": "Congruencias, clases e inversos modulares",
      "route": "/articles/modular-arithmetic",
      "activity": "Interpreta la igualdad de restos y comprueba cuándo existe un inverso."
    }
  ]
};
}
