import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-power-of-point-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './power-of-point-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class PowerOfPointArticleComponent {
  static title = 'La potencia de un punto';
  static route = 'power-of-point';
}
