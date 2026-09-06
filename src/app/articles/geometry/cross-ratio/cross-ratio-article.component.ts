import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-cross-ratio-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './cross-ratio-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class CrossRatioArticleComponent {
  static title = 'La razón cruzada';
  static route = 'cross-ratio';
}
