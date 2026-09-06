import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-pompeiu-theorem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './pompeiu-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class PompeiuTheoremArticleComponent {
  static title = 'Teorema de Pompeiu';
  static route = 'pompeiu-theorem';
}
