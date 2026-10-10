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
  static readonly route = "problema-062";
  static readonly problem: PracticeProblem = {
    "id": "problema-062",
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
