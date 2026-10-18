import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-transformacion-de-mobius-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-transformacion-de-mobius-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaTransformacionDeMobiusProblemComponent {
  static readonly title = "Una transformación de Möbius";
  static readonly route = "mobius-transformation";
  static readonly problem: PracticeProblem = {
  "id": "problema-039",
  "route": "mobius-transformation",
  "number": 39,
  "title": "Una transformación de Möbius",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Reto",
  "statement": "Para \\(z=iy\\), y real, estudia \\(w=(z-1)/(z+1)\\). Demuestra que \\(\\lvert w\\rvert =1\\) y determina qué punto de la circunferencia no aparece.",
  "resources": [
    {
      "label": "Transformaciones de Möbius",
      "route": "/articles/mobius-transformations",
      "activity": "Transformaciones fraccionarias del plano complejo y sus imágenes geométricas."
    },
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Calcula módulos, conjugados y cocientes para verificar las operaciones complejas del ejercicio."
    },
    {
      "label": "Dominio y transformaciones equivalentes",
      "route": "/articles/equation-equivalence",
      "fragment": "domain",
      "activity": "Conserva las exclusiones al cancelar o multiplicar y comprueba las soluciones obtenidas."
    }
  ]
};
}
