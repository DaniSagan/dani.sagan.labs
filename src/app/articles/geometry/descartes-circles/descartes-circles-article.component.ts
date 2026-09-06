import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-descartes-circles-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './descartes-circles-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class DescartesCirclesArticleComponent {
  static title = 'Teorema de Descartes: circunferencias tangentes';
  static route = 'descartes-circles';
}
