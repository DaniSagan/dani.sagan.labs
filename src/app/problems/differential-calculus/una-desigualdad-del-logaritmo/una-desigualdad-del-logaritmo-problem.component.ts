import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-desigualdad-del-logaritmo-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-desigualdad-del-logaritmo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaDesigualdadDelLogaritmoProblemComponent {
  static readonly title = "Una desigualdad del logaritmo";
  static readonly route = "problema-053";
  static readonly problem: PracticeProblem = {
    "id": "problema-053",
    "number": 53,
    "title": "Una desigualdad del logaritmo",
    "category": "Cálculo diferencial y optimización",
    "topic": "Derivadas y teoremas",
    "level": "Oposición",
    "statement": "Demuestra \\(\\ln x\\le x-1\\) para todo \\(x>0\\) e identifica el caso de igualdad.",
    "resources": [
      {
        "label": "Integración clásica",
        "route": "/articles/integration-classical",
        "activity": "La relación entre la primitiva logarítmica y el integrando 1/x explica la derivada utilizada en la función auxiliar."
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
