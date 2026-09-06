import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-casey-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './casey-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class CaseyTheoremArticleComponent {
  static title = 'Teorema de Casey';
  static route = 'casey-theorem';
}
