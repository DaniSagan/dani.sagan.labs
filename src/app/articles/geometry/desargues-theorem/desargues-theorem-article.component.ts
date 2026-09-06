import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-desargues-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './desargues-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class DesarguesTheoremArticleComponent {
  static title = 'Teorema de Desargues';
  static route = 'desargues-theorem';
}
