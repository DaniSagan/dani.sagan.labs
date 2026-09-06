import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-law-of-cosines-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './law-of-cosines-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class LawOfCosinesArticleComponent {
  static title = 'Ley de los cosenos';
  static route = 'law-of-cosines';
}
