import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-trapecios-frente-a-simpson-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './trapecios-frente-a-simpson-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TrapeciosFrenteASimpsonProblemComponent {
  static readonly title = "Trapecios frente a Simpson";
  static readonly route = "trapezoidal-rule-versus-simpson";
  static readonly problem: PracticeProblem = {
  "id": "problema-069",
  "route": "trapezoidal-rule-versus-simpson",
  "number": 69,
  "title": "Trapecios frente a Simpson",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Oposición",
  "statement": "Aproxima \\(\\int_0^1x^2\\,dx\\) usando dos subintervalos iguales con trapecios y Simpson. Compara con el valor exacto.",
  "resources": [
    {
      "label": "Integración numérica",
      "route": "/articles/integration-numerical",
      "activity": "Aproximaciones por trapecios y Simpson y su comparación con integrales exactas."
    },
    {
      "label": "Interpolación de Lagrange y Hermite",
      "route": "/articles/polynomial-interpolation",
      "activity": "Amplía el uso de valores y derivadas para reconstruir un polinomio y controlar su error."
    },
    {
      "label": "Error numérico, cancelación y condicionamiento",
      "route": "/articles/numerical-conditioning",
      "activity": "Separa la sensibilidad del problema de la estabilidad del cálculo y comprueba cancelaciones."
    },
    {
      "label": "Primitivas y teorema fundamental del cálculo",
      "route": "/articles/integration-classical",
      "fragment": "fundamental",
      "activity": "Distingue una familia de funciones de una integral definida con signo."
    },
    {
      "label": "Convexidad y tangentes",
      "route": "/articles/convexity-tangents",
      "activity": "Distingue la posición de las tangentes y de las cuerdas."
    }
  ]
};
}
