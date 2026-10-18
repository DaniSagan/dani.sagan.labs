import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-cubica-con-tres-raices-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-cubica-con-tres-raices-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaCubicaConTresRaicesProblemComponent {
  static readonly title = "Una cúbica con tres raíces";
  static readonly route = "cubic-with-three-roots";
  static readonly problem: PracticeProblem = {
  "id": "problema-011",
  "route": "cubic-with-three-roots",
  "number": 11,
  "title": "Una cúbica con tres raíces",
  "category": "Álgebra y álgebra lineal",
  "topic": "Polinomios y desigualdades",
  "level": "Repaso",
  "statement": "Resuelve \\(x^{3}-6x^{2}+11x-6=0\\) y justifica que no hay más raíces reales.",
  "resources": [
    {
      "label": "La ecuación cúbica",
      "route": "/articles/cubic-equation",
      "activity": "Lectura complementaria sobre raíces, factorización y resolución de ecuaciones polinómicas."
    },
    {
      "label": "Teorema de las raíces racionales",
      "route": "/articles/rational-root-theorem",
      "activity": "Enumera candidatos racionales a partir de los divisores de los coeficientes y verifica cuáles anulan el polinomio."
    },
    {
      "label": "Grado, términos y coeficientes de un polinomio",
      "route": "/articles/polynomial-foundations",
      "fragment": "coefficients",
      "activity": "Identifica los coeficientes, incluye términos ausentes y determina el grado después de simplificar."
    },
    {
      "label": "Teoremas del resto y del factor",
      "route": "/articles/polynomial-division",
      "fragment": "factor-theorem",
      "activity": "Relaciona la evaluación en r con la divisibilidad por x − r."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    }
  ]
};
}
