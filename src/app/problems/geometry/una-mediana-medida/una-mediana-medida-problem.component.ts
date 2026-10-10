import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PracticeProblem } from '../../problem-catalog';
import { ProblemNavigationComponent } from '../../shared/problem-navigation.component';

@Component({
  selector: 'app-una-mediana-medida-problem',
  standalone: true,
  imports: [RouterLink, FormulaComponent, ProblemNavigationComponent],
  templateUrl: './una-mediana-medida-problem.component.html',
  styleUrl: '../../shared/problem.css',
})
export class UnaMedianaMedidaProblemComponent {
  static readonly title = "Una mediana medida";
  static readonly route = "problema-022";
  static readonly problem: PracticeProblem = {
    "id": "problema-022",
    "number": 22,
    "title": "Una mediana medida",
    "category": "Geometría",
    "topic": "Triángulos y áreas",
    "level": "Oposición",
    "statement": "En un triángulo, \\(AB=7\\), \\(AC=5\\) y \\(BC=6\\). Calcula la longitud de la mediana desde A.",
    "resources": [
      {
        "label": "Teorema de Stewart",
        "route": "/articles/stewart-theorem",
        "activity": "Relaciones métricas para cevianas; la mediana proporciona un caso particular."
      },
      {
        "label": "Curvas implícitas",
        "route": "/tools/implicit-curve-graph",
        "activity": "Representa las ecuaciones de los ejercicios «Recta y circunferencia», «Una hipérbola trasladada» y comprueba intersecciones y asíntotas."
      }
    ]
  };
}
