import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-area-entre-dos-curvas-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './area-entre-dos-curvas-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class AreaEntreDosCurvasProblemComponent {
  static readonly title = "Área entre dos curvas";
  static readonly route = "problema-066";
  static readonly problem: PracticeProblem = {
    "id": "problema-066",
    "number": 66,
    "title": "Área entre dos curvas",
    "category": "Integración y cálculo numérico",
    "topic": "Áreas, volúmenes y aproximación",
    "level": "Repaso",
    "statement": "Calcula el área encerrada entre \\(y=x\\) e \\(y=x^{2}\\).",
    "resources": [
      {
        "label": "Parábola",
        "route": "/articles/parabola",
        "activity": "Propiedades geométricas de la curva que aparece en el cálculo del ejercicio."
      },
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
