import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-paradoja-al-mezclar-grupos-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-paradoja-al-mezclar-grupos-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaParadojaAlMezclarGruposProblemComponent {
  static readonly title = "Una paradoja al mezclar grupos";
  static readonly route = "simpsons-paradox-when-mixing-groups";
  static readonly problem: PracticeProblem = {
  "id": "problema-190",
  "route": "simpsons-paradox-when-mixing-groups",
  "number": 190,
  "title": "Una paradoja al mezclar grupos",
  "category": "Estadística y lectura crítica de datos",
  "topic": "Inferencia y muestreo",
  "level": "Oposición",
  "statement": "El método A logra 81/90 éxitos en casos fáciles y 2/10 en difíciles. B logra 19/20 y 24/80, respectivamente. Compara por grupo y en conjunto.",
  "resources": [
    {
      "label": "Paradoja de Simpson",
      "route": "/articles/simpson-paradox",
      "activity": "Practica una paradoja al mezclar grupos. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Media, mediana, varianza y desviación típica",
      "route": "/articles/descriptive-statistics",
      "activity": "Distingue posición de dispersión y especifica el divisor de la varianza."
    },
    {
      "label": "Sesgo de selección y representatividad",
      "route": "/articles/sampling-bias",
      "activity": "Un tamaño grande no corrige una selección que excluye parte de la población."
    }
  ]
};
}
