import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-punto-mas-cercano-de-una-parabola-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-punto-mas-cercano-de-una-parabola-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElPuntoMasCercanoDeUnaParabolaProblemComponent {
  static readonly title = "El punto más cercano de una parábola";
  static readonly route = "problema-058";
  static readonly problem: PracticeProblem = {
    "id": "problema-058",
    "number": 58,
    "title": "El punto más cercano de una parábola",
    "category": "Cálculo diferencial y optimización",
    "topic": "Optimización y modelos",
    "level": "Reto",
    "statement": "Halla los puntos de \\(y=x^{2}\\) más próximos a \\(P=(0,3)\\) y su distancia.",
    "resources": [
      {
        "label": "Parábola",
        "route": "/articles/parabola",
        "activity": "Propiedades geométricas de la curva que aparece en el cálculo del ejercicio."
      },
      {
        "label": "Representador de funciones",
        "route": "/tools/graph-plotter",
        "activity": "Representa x*exp(-x) para verificar la forma global descrita en el ejercicio «Estudio global de una función»."
      },
      {
        "label": "Campo vectorial",
        "route": "/tools/vector-field",
        "activity": "Explora el campo (−y,x) del ejercicio «Órbitas de un campo vectorial» y observa las trayectorias circulares."
      }
    ]
  };
}
