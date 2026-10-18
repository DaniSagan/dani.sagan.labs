import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-potencia-en-forma-polar-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-potencia-en-forma-polar-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaPotenciaEnFormaPolarProblemComponent {
  static readonly title = "Una potencia en forma polar";
  static readonly route = "complex-power-in-polar-form";
  static readonly problem: PracticeProblem = {
  "id": "problema-038",
  "route": "complex-power-in-polar-form",
  "number": 38,
  "title": "Una potencia en forma polar",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Calcula \\((1+i)^{12}\\) en forma binómica.",
  "resources": [
    {
      "label": "Fórmula de De Moivre: potencias y raíces complejas",
      "route": "/articles/de-moivre",
      "activity": "Relaciona las hipótesis y las ecuaciones del artículo con la solución de este ejercicio."
    },
    {
      "label": "Identidad de Euler",
      "route": "/articles/euler-identity",
      "activity": "La conexión entre forma polar, exponencial compleja, seno y coseno."
    },
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Calcula módulos, conjugados y cocientes para verificar las operaciones complejas del ejercicio."
    },
    {
      "label": "Radianes y longitud de arco",
      "route": "/articles/radians",
      "activity": "Convierte grados a radianes antes de aplicar longitud = radio por ángulo."
    }
  ]
};
}
