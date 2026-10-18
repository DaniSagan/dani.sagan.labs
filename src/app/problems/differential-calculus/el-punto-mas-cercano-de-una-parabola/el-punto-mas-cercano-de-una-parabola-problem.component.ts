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
  static readonly route = "nearest-point-on-a-parabola";
  static readonly problem: PracticeProblem = {
  "id": "problema-058",
  "route": "nearest-point-on-a-parabola",
  "number": 58,
  "title": "El punto más cercano de una parábola",
  "category": "Cálculo diferencial y optimización",
  "topic": "Optimización y modelos",
  "level": "Reto",
  "statement": "Halla los puntos de \\(y=x^{2}\\) más próximos a \\(P=(0,3)\\) y su distancia.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Optimización con derivadas",
      "route": "/articles/derivative-optimization",
      "activity": "Construye la función objetivo, determina el dominio y compara candidatos interiores y extremos para justificar el óptimo global."
    },
    {
      "label": "Parábola",
      "route": "/articles/parabola",
      "activity": "Propiedades geométricas de la curva que aparece en el cálculo del ejercicio."
    },
    {
      "label": "Pitágoras y distancia euclídea",
      "route": "/articles/pythagorean-distance",
      "activity": "Justifica las distancias con componentes ortogonales y conserva los términos cruzados cuando no lo sean."
    },
    {
      "label": "Extremos globales y teorema de Weierstrass",
      "route": "/articles/global-extrema-weierstrass",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    }
  ]
};
}
