import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-morley-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './morley-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class MorleyTheoremArticleComponent {
  static title = 'Teorema de Morley';
  static route = 'morley-theorem';
}
