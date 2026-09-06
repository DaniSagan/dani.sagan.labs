import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-brianchon-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './brianchon-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class BrianchonTheoremArticleComponent {
  static title = 'Teorema de Brianchon';
  static route = 'brianchon-theorem';
}
