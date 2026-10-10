import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-estudio-global-de-una-funcion-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './estudio-global-de-una-funcion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class EstudioGlobalDeUnaFuncionProblemComponent {
  static readonly title = "Estudio global de una función";
  static readonly route = "problema-052";
  static readonly problem: PracticeProblem = {
    "id": "problema-052",
    "number": 52,
    "title": "Estudio global de una función",
    "category": "Cálculo diferencial y optimización",
    "topic": "Derivadas y teoremas",
    "level": "Oposición",
    "statement": "Estudia crecimiento, extremos, concavidad y límites de \\(f(x)=xe^{-x}\\) en \\(\\mathbb{R}\\).",
    "resources": [
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "Los desarrollos de la exponencial ofrecen otra descripción local de la función; el estudio global del ejercicio usa además signos de derivadas y límites."
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
