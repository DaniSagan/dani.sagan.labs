import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-taylor-con-control-del-error-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './taylor-con-control-del-error-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class TaylorConControlDelErrorProblemComponent {
  static readonly title = "Taylor con control del error";
  static readonly route = "taylor-error-bound";
  static readonly problem: PracticeProblem = {
  "id": "problema-055",
  "route": "taylor-error-bound",
  "number": 55,
  "title": "Taylor con control del error",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Oposición",
  "statement": "Aproxima \\(e^{\\frac{1}{10}}\\) mediante el polinomio de Taylor de grado 2 en 0 y acota el error usando \\(e^{\\frac{1}{10}}<2\\).",
  "resources": [
    {
      "label": "Derivadas: definición, interpretación y reglas",
      "route": "/articles/derivative-foundations",
      "activity": "Parte del cociente incremental, respeta los dominios y distingue una condición necesaria de una prueba suficiente de extremo."
    },
    {
      "label": "Series de Taylor",
      "route": "/articles/taylor-series",
      "activity": "Aproximaciones locales, derivadas y términos de error en desarrollos de funciones."
    },
    {
      "label": "Interpolación de Lagrange y Hermite",
      "route": "/articles/polynomial-interpolation",
      "activity": "Amplía el uso de valores y derivadas para reconstruir un polinomio y controlar su error."
    },
    {
      "label": "Diferenciales y aproximación lineal",
      "route": "/articles/linear-approximation",
      "activity": "Interpreta la derivada como cambio lineal y separa el incremento real del error de aproximación."
    },
    {
      "label": "Error numérico, cancelación y condicionamiento",
      "route": "/articles/numerical-conditioning",
      "activity": "Separa la sensibilidad del problema de la estabilidad del cálculo y comprueba cancelaciones."
    },
    {
      "label": "Exponenciales y logaritmos",
      "route": "/articles/exponentials-logarithms",
      "activity": "Respeta el dominio y utiliza las funciones inversas para despejar."
    }
  ]
};
}
