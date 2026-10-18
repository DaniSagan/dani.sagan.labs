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
  static readonly route = "logarithmic-tangent";
  static readonly problem: PracticeProblem = {
  "id": "problema-051",
  "route": "logarithmic-tangent",
  "number": 51,
  "title": "Una tangente logarítmica",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Halla la recta tangente a \\(f(x)=\\ln x\\) en \\(x=e\\) y el punto donde corta el eje x.",
  "resources": [
    {
      "label": "Exponenciales y logaritmos: propiedades y ecuaciones",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio del logaritmo, transforma cocientes adimensionales y distingue cambio relativo constante de crecimiento polinómico."
    },
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Teoremas de Rolle y del valor medio",
      "route": "/articles/mean-value-theorems",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Estudio completo de funciones",
      "route": "/articles/function-analysis",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
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
      "label": "Diferenciales y aproximación lineal",
      "route": "/articles/linear-approximation",
      "activity": "Interpreta la derivada como cambio lineal y separa el incremento real del error de aproximación."
    }
  ]
};
}
