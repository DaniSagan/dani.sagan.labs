import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-orbitas-de-un-campo-vectorial-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './orbitas-de-un-campo-vectorial-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class OrbitasDeUnCampoVectorialProblemComponent {
  static readonly title = "Órbitas de un campo vectorial";
  static readonly route = "problema-060";
  static readonly problem: PracticeProblem = {
    "id": "problema-060",
    "number": 60,
    "title": "Órbitas de un campo vectorial",
    "category": "Cálculo diferencial y optimización",
    "topic": "Optimización y modelos",
    "level": "Reto",
    "statement": "Para el sistema \\(x'=-y\\), \\(y'=x\\), con \\((x(0),y(0))=(2,0)\\), halla la trayectoria, el sentido y el período.",
    "resources": [
      {
        "label": "Autómatas celulares",
        "route": "/articles/cellular-automata",
        "activity": "Este ejercicio usa un sistema diferencial continuo. El artículo permite contrastarlo con la evolución por pasos discretos de un autómata."
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
