import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-nine-point-circle-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './nine-point-circle-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class NinePointCircleArticleComponent {
  static title = 'La circunferencia de los nueve puntos';
  static route = 'nine-point-circle';
}
