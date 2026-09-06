import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-brahmagupta-formula-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './brahmagupta-formula-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class BrahmaguptaFormulaArticleComponent {
  static title = 'Fórmula de Brahmagupta';
  static route = 'brahmagupta-formula';
}
