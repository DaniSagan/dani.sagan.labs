import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-integral-que-contiene-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-integral-que-contiene-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaIntegralQueContieneProblemComponent {
  static readonly title = "Una integral que contiene π";
  static readonly route = "problema-070";
  static readonly problem: PracticeProblem = {
    "id": "problema-070",
    "number": 70,
    "title": "Una integral que contiene π",
    "category": "Integración y cálculo numérico",
    "topic": "Áreas, volúmenes y aproximación",
    "level": "Reto",
    "statement": "Demuestra que \\(\\int_0^1\\sqrt{1-x^2}\\,dx=\\frac\\pi4\\) y deduce \\(2<\\pi<4\\) sin usar decimales.",
    "resources": [
      {
        "label": "Áreas entre curvas y sólidos de revolución",
        "route": "/articles/areas-revolution",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
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
      },
      {
        "label": "Pitágoras y distancia euclídea",
        "route": "/articles/pythagorean-distance",
        "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
      }
    ]
  };
}
