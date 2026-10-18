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
  static readonly route = "improper-integral-with-parameter";
  static readonly problem: PracticeProblem = {
  "id": "problema-065",
  "route": "improper-integral-with-parameter",
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
      "label": "Inecuaciones y tablas de signos",
      "route": "/articles/sign-charts",
      "activity": "Organiza ceros y puntos excluidos por intervalos y combina correctamente las condiciones de signo."
    },
    {
      "label": "Criterios de convergencia de series positivas",
      "route": "/articles/positive-series-tests",
      "activity": "Compara el comportamiento asintótico con series modelo y revisa las fronteras de cada criterio."
    },
    {
      "label": "Integrales impropias y convergencia",
      "route": "/articles/integration-classical",
      "fragment": "improper",
      "activity": "Define primero el límite truncado y decide si es finito."
    },
    {
      "label": "Exponenciales y logaritmos",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio y utiliza las funciones inversas para despejar."
    },
    {
      "label": "Equivalencias y órdenes de crecimiento",
      "route": "/articles/asymptotic-limits",
      "activity": "Compara los términos dominantes y controla el error tras cancelar."
    }
  ]
};
}
