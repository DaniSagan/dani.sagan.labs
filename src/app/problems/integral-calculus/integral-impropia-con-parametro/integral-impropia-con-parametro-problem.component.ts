import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-integral-impropia-con-parametro-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './integral-impropia-con-parametro-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class IntegralImpropiaConParametroProblemComponent {
  static readonly title = "Integral impropia con parámetro";
  static readonly route = "problema-065";
  static readonly problem: PracticeProblem = {
    "id": "problema-065",
    "number": 65,
    "title": "Integral impropia con parámetro",
    "category": "Integración y cálculo numérico",
    "topic": "Primitivas e integrales",
    "level": "Oposición",
    "statement": "Estudia para qué \\(p\\in\\mathbb R\\) converge \\(\\int_1^{\\infty}x^{-p}\\,dx\\) y calcula su valor cuando converge.",
    "resources": [
      {
        "label": "Integración avanzada",
        "route": "/articles/integration-advanced",
        "activity": "Lectura complementaria sobre integrales impropias y las condiciones de su convergencia."
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
