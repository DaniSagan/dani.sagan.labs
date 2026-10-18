import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integral-racional-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integral-racional-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegralRacionalProblemComponent {
  static readonly title = "Una integral racional";
  static readonly route = "rational-integral";
  static readonly problem: PracticeProblem = {
  "id": "problema-063",
  "route": "rational-integral",
  "number": 63,
  "title": "Una integral racional",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Oposición",
  "statement": "Calcula \\(\\int_0^1\\frac{1}{x^2+3x+2}\\,dx\\).",
  "resources": [
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Identidades notables y factorización",
      "route": "/articles/algebraic-identities-factorization",
      "activity": "Desarrolla o agrupa términos para justificar la factorización utilizada."
    },
    {
      "label": "Exponenciales y logaritmos",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio y utiliza las funciones inversas para despejar."
    }
  ]
};
}
