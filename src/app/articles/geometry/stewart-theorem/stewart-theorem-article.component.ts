import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-stewart-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './stewart-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class StewartTheoremArticleComponent {
  static title = 'Teorema de Stewart';
  static route = 'stewart-theorem';
}
