import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-longitud-y-dimension-de-cantor-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './longitud-y-dimension-de-cantor-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LongitudYDimensionDeCantorProblemComponent {
  static readonly title = "Longitud y dimensión de Cantor";
  static readonly route = "problema-100";
  static readonly problem: PracticeProblem = {
    "id": "problema-100",
    "number": 100,
    "title": "Longitud y dimensión de Cantor",
    "category": "Combinatoria, juegos y modelización",
    "topic": "Dinámica y aplicaciones",
    "level": "Reto",
    "statement": "En el conjunto ternario de Cantor, calcula la longitud total restante tras n etapas, la longitud total eliminada en el límite y la dimensión de autosimilitud.",
    "resources": [
      {
        "label": "Medida cero y dimensión fractal",
        "route": "/articles/zero-measure-dimension",
        "activity": "Separa longitud, cardinalidad y dimensión; calcula las etapas y justifica las propiedades del conjunto límite."
      },
      {
        "label": "Medida, dimensión y autosimilitud",
        "route": "/articles/fractal-measure-dimension",
        "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
      },
      {
        "label": "Conjunto de Cantor",
        "route": "/articles/cantor-set",
        "activity": "La construcción por etapas y la autosimilitud del conjunto ternario."
      },
      {
        "label": "Inducción matemática y construcción de pruebas",
        "route": "/articles/mathematical-induction",
        "activity": "Demuestra la identidad o la estructura de todas las etapas, separando caso inicial y paso inductivo."
      },
      {
        "label": "Progresiones y series geométricas",
        "route": "/articles/geometric-series",
        "activity": "Reconoce la razón multiplicativa y distingue suma finita, límite y resto geométrico."
      },
      {
        "label": "Cardinalidad y argumento diagonal",
        "route": "/articles/cardinality-diagonal",
        "activity": "Demuestra incontabilidad mediante diagonal y separa cardinalidad, medida y densidad."
      },
      {
        "label": "Función de Cantor y distribuciones singulares",
        "route": "/articles/cantor-function",
        "activity": "Amplía la noción de distribución continua con una acumulada singular concentrada en Cantor."
      },
      {
        "label": "Compactos, perfectos y totalmente desconectados",
        "route": "/articles/compact-perfect-disconnected",
        "activity": "Prueba compacidad, ausencia de puntos aislados y desconexión sin confundir etapas finitas con el límite."
      }
    ]
  };
}
