import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-euler-line-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './euler-line-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class EulerLineArticleComponent {
  static title = 'La recta de Euler';
  static route = 'euler-line';
}
