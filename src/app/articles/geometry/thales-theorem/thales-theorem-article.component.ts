import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-thales-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './thales-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class ThalesTheoremArticleComponent {
  static title = 'Teorema de Tales: el ángulo inscrito';
  static route = 'thales-theorem';
}
