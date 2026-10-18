import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-funcion-con-esquina-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-funcion-con-esquina-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaFuncionConEsquinaProblemComponent {
  static readonly title = "Una función con esquina";
  static readonly route = "function-with-a-corner";
  static readonly problem: PracticeProblem = {
  "id": "problema-160",
  "route": "function-with-a-corner",
  "number": 160,
  "title": "Una función con esquina",
  "category": "Cálculo diferencial y optimización",
  "topic": "Derivadas y teoremas",
  "level": "Repaso",
  "statement": "Estudia la continuidad y derivabilidad en cero de f(x)=|x|.",
  "resources": [
    {
      "label": "Continuidad y derivabilidad: funciones a trozos",
      "route": "/articles/continuity-differentiability",
      "activity": "Practica una función con esquina. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Valor absoluto: distancias y funciones a trozos",
      "route": "/articles/absolute-value-distance",
      "activity": "Repasa los fundamentos y las justificaciones del método, y aplica los ejemplos del artículo a este problema."
    },
    {
      "label": "Definición y reglas de derivación",
      "route": "/articles/derivative-foundations",
      "activity": "Interpreta la derivada como límite de pendientes y justifica la regla aplicada."
    }
  ]
};
}
