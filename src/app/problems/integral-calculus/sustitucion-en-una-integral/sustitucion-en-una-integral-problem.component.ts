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
  static readonly route = "problema-061";
  static readonly problem: PracticeProblem = {
    "id": "problema-061",
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
        "label": "Decimales de π",
        "route": "/tools/pi-decimals",
        "activity": "Compara los decimales de π con la cota obtenida mediante el ejercicio «Una integral que contiene π»; distingue cálculo de demostración."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Dibuja x²+y²=1 y relaciona el cuarto de disco con la integral del ejercicio «Una integral que contiene π»."
      }
    ]
  };
}
