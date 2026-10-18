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
  static readonly route = "logarithmic-inequality";
  static readonly problem: PracticeProblem = {
  "id": "problema-053",
  "route": "logarithmic-inequality",
  "number": 53,
  "title": "Una desigualdad del logaritmo",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Oposición",
  "statement": "Demuestra \\(\\ln x\\le x-1\\) para todo \\(x>0\\) e identifica el caso de igualdad.",
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
      "label": "Convexidad, concavidad y desigualdades",
      "route": "/articles/convexity-tangents",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Integración clásica",
      "route": "/articles/integration-classical",
      "activity": "La relación entre la primitiva logarítmica y el integrando 1/x explica la derivada utilizada en la función auxiliar."
    },
    {
      "label": "Extremos globales y Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Distingue extremo alcanzado de ínfimo o supremo y revisa los bordes."
    },
    {
      "label": "Contradicción, implicación y equivalencia",
      "route": "/articles/proof-strategies",
      "activity": "Separa una demostración para todos los casos de una comprobación particular."
    }
  ]
};
}
