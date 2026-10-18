import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-rotacion-en-el-plano-complejo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-rotacion-en-el-plano-complejo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaRotacionEnElPlanoComplejoProblemComponent {
  static readonly title = "Una rotación en el plano complejo";
  static readonly route = "complex-plane-rotation";
  static readonly problem: PracticeProblem = {
  "id": "problema-139",
  "route": "complex-plane-rotation",
  "number": 139,
  "title": "Una rotación en el plano complejo",
  "category": "Trigonometría y números complejos",
  "topic": "Plano complejo",
  "level": "Repaso",
  "statement": "Interpreta la transformación z↦iz y aplícala al punto 3−2i cuatro veces.",
  "resources": [
    {
      "label": "Conjugado, módulo y división compleja",
      "route": "/articles/complex-arithmetic",
      "activity": "Practica una rotación en el plano complejo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Forma polar, raíces y De Moivre",
      "route": "/articles/de-moivre",
      "activity": "Eleva el módulo y multiplica el argumento; enumera todas las raíces."
    },
    {
      "label": "Permutaciones, simetrías y orden",
      "route": "/articles/permutation-symmetries",
      "activity": "Distingue una transformación de sus iteraciones y busca cuándo vuelve la identidad."
    }
  ]
};
}
