import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-sustitucion-en-una-integral-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './sustitucion-en-una-integral-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class SustitucionEnUnaIntegralProblemComponent {
  static readonly title = "Sustitución en una integral";
  static readonly route = "integration-by-substitution";
  static readonly problem: PracticeProblem = {
  "id": "problema-061",
  "route": "integration-by-substitution",
  "number": 61,
  "title": "Sustitución en una integral",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Calcula \\(\\int_0^1\\frac{2x}{1+x^2}\\,dx\\).",
  "resources": [
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "Sustitución, partes, fracciones simples y aplicación de primitivas a integrales definidas."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    },
    {
      "label": "Exponenciales y logaritmos",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio y utiliza las funciones inversas para despejar."
    }
  ]
};
}
