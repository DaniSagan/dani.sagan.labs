import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-pick-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './pick-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class PickTheoremArticleComponent {
  static title = 'Teorema de Pick';
  static route = 'pick-theorem';
}
