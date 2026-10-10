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
  static readonly route = "problema-055";
  static readonly problem: PracticeProblem = {
    "id": "problema-055",
    "number": 55,
    "title": "Taylor con control del error",
    "category": "Cálculo diferencial y optimización",
    "topic": "Derivadas y teoremas",
    "level": "Oposición",
    "statement": "Aproxima \\(e^{\\frac{1}{10}}\\) mediante el polinomio de Taylor de grado 2 en 0 y acota el error usando \\(e^{\\frac{1}{10}}<2\\).",
    "resources": [
      {
        "label": "Series de Taylor",
        "route": "/articles/taylor-series",
        "activity": "Aproximaciones locales, derivadas y términos de error en desarrollos de funciones."
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
