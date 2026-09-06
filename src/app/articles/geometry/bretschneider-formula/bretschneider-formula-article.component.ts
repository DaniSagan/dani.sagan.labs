import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-bretschneider-formula-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './bretschneider-formula-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class BretschneiderFormulaArticleComponent {
  static title = 'Fórmula de Brahmagupta–Bretschneider';
  static route = 'bretschneider-formula';
}
