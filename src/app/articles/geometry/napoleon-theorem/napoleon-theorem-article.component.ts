import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-napoleon-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './napoleon-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class NapoleonTheoremArticleComponent {
  static title = 'Teorema de Napoleón';
  static route = 'napoleon-theorem';
}
