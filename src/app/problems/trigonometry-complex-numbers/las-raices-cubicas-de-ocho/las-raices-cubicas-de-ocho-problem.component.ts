import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-las-raices-cubicas-de-ocho-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './las-raices-cubicas-de-ocho-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class LasRaicesCubicasDeOchoProblemComponent {
  static readonly title = "Las raíces cúbicas de ocho";
  static readonly route = "cube-roots-of-eight";
  static readonly problem: PracticeProblem = {
  "id": "problema-138",
  "route": "cube-roots-of-eight",
  "number": 138,
  "title": "Las raíces cúbicas de ocho",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Encuentra todas las soluciones complejas de z³=8 y comprueba que no falta ninguna.",
  "resources": [
    {
      "label": "Fórmula de De Moivre: potencias y raíces complejas",
      "route": "/articles/de-moivre",
      "activity": "Practica las raíces cúbicas de ocho. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Aritmética compleja, módulo y conjugado",
      "route": "/articles/complex-arithmetic",
      "activity": "Calcula en forma binómica y usa el conjugado para dividir."
    },
    {
      "label": "Raíces, factores y multiplicidad",
      "route": "/articles/polynomial-foundations",
      "fragment": "roots",
      "activity": "Distingue raíces distintas de raíces contadas con multiplicidad y usa el producto nulo."
    }
  ]
};
}
