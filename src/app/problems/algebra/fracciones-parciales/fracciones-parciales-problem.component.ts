import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-fracciones-parciales-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './fracciones-parciales-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class FraccionesParcialesProblemComponent {
  static readonly title = "Fracciones parciales";
  static readonly route = "partial-fractions";
  static readonly problem: PracticeProblem = {
  "id": "problema-015",
  "route": "partial-fractions",
  "number": 15,
  "title": "Fracciones parciales",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Oposición",
  "statement": "Descompón \\(\\frac{3x+5}{(x+1)(x+2)}\\) en fracciones simples e indica su dominio.",
  "resources": [
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Grado, términos y coeficientes de un polinomio",
      "route": "/articles/polynomial-foundations",
      "fragment": "coefficients",
      "activity": "Identifica los coeficientes, incluye términos ausentes y determina el grado después de simplificar."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    },
    {
      "label": "Eliminación de Gauss y sistemas compatibles",
      "route": "/articles/gaussian-elimination",
      "activity": "Entiende qué operaciones conservan las soluciones de un sistema."
    }
  ]
};
}
