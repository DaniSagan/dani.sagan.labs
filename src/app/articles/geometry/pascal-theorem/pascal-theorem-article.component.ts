import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-pascal-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './pascal-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class PascalTheoremArticleComponent {
  static title = 'Teorema de Pascal: el hexagrama místico';
  static route = 'pascal-theorem';
}
