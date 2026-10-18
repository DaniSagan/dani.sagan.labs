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
  static readonly route = "volume-by-disk-method";
  static readonly problem: PracticeProblem = {
  "id": "problema-067",
  "route": "volume-by-disk-method",
  "number": 67,
  "title": "Volumen por discos",
  "category": "Integración y cálculo numérico",
  "topic": "Áreas, volúmenes y aproximación",
  "level": "Oposición",
  "statement": "Gira alrededor del eje x la región \\(0\\le x\\le 1\\), \\(0\\le y\\le \\sqrt{x}\\). Calcula el volumen.",
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
      "label": "Análisis dimensional",
      "route": "/articles/dimensional-analysis",
      "activity": "Iguala los exponentes de las dimensiones y distingue escala de constante física."
    }
  ]
};
}
