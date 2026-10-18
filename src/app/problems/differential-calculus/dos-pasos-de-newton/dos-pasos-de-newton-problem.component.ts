import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-dos-pasos-de-newton-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './dos-pasos-de-newton-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class DosPasosDeNewtonProblemComponent {
  static readonly title = "Dos pasos de Newton";
  static readonly route = "two-newton-iterations";
  static readonly problem: PracticeProblem = {
  "id": "problema-054",
  "route": "two-newton-iterations",
  "number": 54,
  "title": "Dos pasos de Newton",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Oposición",
  "statement": "Aplica dos iteraciones de Newton a \\(x^{2}-2=0\\) desde \\(x_{0}=1\\), con aritmética exacta.",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Newton–Raphson",
      "route": "/articles/newton-raphson",
      "activity": "Búsqueda de raíces mediante rectas tangentes e iteraciones sucesivas."
    },
    {
      "label": "Teorema del punto fijo de Banach",
      "route": "/articles/banach-fixed-point",
      "activity": "Amplía el análisis de iteraciones con conservación del dominio, contracción y cotas de error."
    },
    {
      "label": "Error numérico, cancelación y condicionamiento",
      "route": "/articles/numerical-conditioning",
      "activity": "Separa la sensibilidad del problema de la estabilidad del cálculo y comprueba cancelaciones."
    },
    {
      "label": "Ecuaciones cuadráticas",
      "route": "/articles/quadratic-equations",
      "activity": "Resuelve la ecuación de segundo grado y distingue los casos degenerados."
    }
  ]
};
}
