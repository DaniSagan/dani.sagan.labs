import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integracion-por-partes-completa-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integracion-por-partes-completa-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegracionPorPartesCompletaProblemComponent {
  static readonly title = "Una integración por partes completa";
  static readonly route = "definite-integration-by-parts";
  static readonly problem: PracticeProblem = {
  "id": "problema-164",
  "route": "definite-integration-by-parts",
  "number": 164,
  "title": "Una integración por partes completa",
  "category": "Integración y cálculo numérico",
  "topic": "Primitivas e integrales",
  "level": "Repaso",
  "statement": "Calcula la integral de x eˣ entre 0 y 1 justificando la fórmula usada.",
  "resources": [
    {
      "label": "Integrales I: técnicas clásicas",
      "route": "/articles/integration-classical",
      "activity": "Practica una integración por partes completa. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
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
