import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-apollonius-problem-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './apollonius-problem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class ApolloniusProblemArticleComponent {
  static title = 'El problema de Apolonio';
  static route = 'apollonius-problem';
}
