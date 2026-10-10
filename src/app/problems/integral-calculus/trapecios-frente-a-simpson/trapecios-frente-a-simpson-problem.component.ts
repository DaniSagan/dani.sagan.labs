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
  static readonly route = "problema-069";
  static readonly problem: PracticeProblem = {
    "id": "problema-069",
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
