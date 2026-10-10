import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-tangente-logaritmica-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-tangente-logaritmica-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaTangenteLogaritmicaProblemComponent {
  static readonly title = "Una tangente logarítmica";
  static readonly route = "problema-051";
  static readonly problem: PracticeProblem = {
    "id": "problema-051",
    "number": 51,
    "title": "Una tangente logarítmica",
    "category": "Cálculo diferencial y optimización",
    "topic": "Derivadas y teoremas",
    "level": "Repaso",
    "statement": "Halla la recta tangente a \\(f(x)=\\ln x\\) en \\(x=e\\) y el punto donde corta el eje x.",
    "resources": [
      {
        "label": "Integración clásica",
        "route": "/articles/integration-classical",
        "activity": "La derivada de una primitiva recupera el integrando. La identidad ∫dx/x=ln∣x∣+C conecta la integración clásica con la pendiente usada aquí."
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
