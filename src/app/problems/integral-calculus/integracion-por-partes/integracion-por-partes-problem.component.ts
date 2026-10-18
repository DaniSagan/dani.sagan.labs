import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-integracion-por-partes-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './integracion-por-partes-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class IntegracionPorPartesProblemComponent {
  static readonly title = "Integración por partes";
  static readonly route = "integration-by-parts";
  static readonly problem: PracticeProblem = {
  "id": "problema-062",
  "route": "integration-by-parts",
  "number": 62,
  "title": "Integración por partes",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Calcula \\(\\int_0^1xe^x\\,dx\\).",
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
