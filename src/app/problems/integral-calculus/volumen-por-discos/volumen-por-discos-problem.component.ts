import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-volumen-por-discos-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './volumen-por-discos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class VolumenPorDiscosProblemComponent {
  static readonly title = "Volumen por discos";
  static readonly route = "problema-067";
  static readonly problem: PracticeProblem = {
    "id": "problema-067",
    "number": 67,
    "title": "Volumen por discos",
    "category": "Integración y cálculo numérico",
    "topic": "Áreas, volúmenes y aproximación",
    "level": "Oposición",
    "statement": "Gira alrededor del eje x la región \\(0\\le x\\le 1\\), \\(0\\le y\\le \\sqrt{x}\\). Calcula el volumen.",
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
