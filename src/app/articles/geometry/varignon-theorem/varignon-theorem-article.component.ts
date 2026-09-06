import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-varignon-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './varignon-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class VarignonTheoremArticleComponent {
  static title = 'Teorema de Varignon';
  static route = 'varignon-theorem';
}
