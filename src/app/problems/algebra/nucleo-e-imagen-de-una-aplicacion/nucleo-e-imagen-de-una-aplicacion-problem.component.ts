import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-nucleo-e-imagen-de-una-aplicacion-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './nucleo-e-imagen-de-una-aplicacion-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class NucleoEImagenDeUnaAplicacionProblemComponent {
  static readonly title = "Núcleo e imagen de una aplicación";
  static readonly route = 'problema-117';
  static readonly problem: PracticeProblem = {
  "id": "problema-117",
  "number": 117,
  "title": "Núcleo e imagen de una aplicación",
  "category": "Álgebra y álgebra lineal",
  "topic": "Matrices y sistemas",
  "level": "Repaso",
  "statement": "Para T(x,y,z)=(x+y,y+z), describe el núcleo y la imagen y comprueba rango más nulidad.",
  "resources": [
    {
      "label": "Espacios vectoriales, bases y rango–nulidad",
      "route": "/articles/vector-spaces",
      "activity": "Practica núcleo e imagen de una aplicación. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    }
  ]
};
}
