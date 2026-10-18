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
  static readonly route = "complete-function-analysis";
  static readonly problem: PracticeProblem = {
  "id": "problema-052",
  "route": "complete-function-analysis",
  "number": 52,
  "title": "Estudio global de una función",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Oposición",
  "statement": "Estudia crecimiento, extremos, concavidad y límites de \\(f(x)=xe^{-x}\\) en \\(\\mathbb{R}\\).",
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
      "label": "Estudio completo de funciones",
      "route": "/articles/function-analysis",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Convexidad, concavidad y desigualdades",
      "route": "/articles/convexity-tangents",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
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
      "label": "Inecuaciones y tablas de signos",
      "route": "/articles/sign-charts",
      "activity": "Organiza ceros y puntos excluidos por intervalos y combina correctamente las condiciones de signo."
    }
  ]
};
}
