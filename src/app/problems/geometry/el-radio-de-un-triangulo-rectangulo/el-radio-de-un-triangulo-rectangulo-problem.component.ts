import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-el-radio-de-un-triangulo-rectangulo-problem', standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './el-radio-de-un-triangulo-rectangulo-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class ElRadioDeUnTrianguloRectanguloProblemComponent {
  static readonly title = "El radio de un triángulo rectángulo";
  static readonly route = "right-triangle-inradius";
  static readonly problem: PracticeProblem = {
  "id": "problema-122",
  "route": "right-triangle-inradius",
  "number": 122,
  "title": "El radio de un triángulo rectángulo",
  "category": "Geometría",
  "topic": "Triángulos y áreas",
  "level": "Repaso",
  "statement": "Calcula el inradio y el circunradio de un triángulo rectángulo con catetos 6 y 8.",
  "resources": [
    {
      "label": "Circunferencias inscritas y circunscritas",
      "route": "/articles/incircles-circumcircles",
      "activity": "Practica el radio de un triángulo rectángulo. Revisa en el artículo las definiciones y contrasta cada cálculo con la solución razonada."
    },
    {
      "label": "Medianas, alturas, incentro y métricas del triángulo",
      "route": "/articles/triangle-metrics",
      "activity": "Distingue los segmentos y centros del triángulo y sus relaciones con el área."
    },
    {
      "label": "Teorema de Pitágoras y distancia",
      "route": "/articles/pythagorean-distance",
      "activity": "Comprueba la perpendicularidad necesaria antes de sumar cuadrados."
    },
    {
      "label": "Fórmula de Herón y semiperímetro",
      "route": "/articles/heron-formula",
      "activity": "Comprueba que los lados forman un triángulo antes de calcular su área."
    }
  ]
};
}
