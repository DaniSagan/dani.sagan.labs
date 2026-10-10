import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-longitud-de-una-curva-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './longitud-de-una-curva-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LongitudDeUnaCurvaProblemComponent {
  static readonly title = "Longitud de una curva";
  static readonly route = "problema-068";
  static readonly problem: PracticeProblem = {
    "id": "problema-068",
    "number": 68,
    "title": "Longitud de una curva",
    "category": "Integración y cálculo numérico",
    "topic": "Áreas, volúmenes y aproximación",
    "level": "Reto",
    "statement": "Calcula la longitud del arco \\(y=(\\frac{2}{3})x^{\\frac{3}{2}}\\) para \\(0\\le x\\le 3\\).",
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
