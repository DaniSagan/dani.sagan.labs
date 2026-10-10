import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-euler-triangle-formula-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, GeometryDiagramComponent],
  templateUrl: './euler-triangle-formula-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class EulerTriangleFormulaArticleComponent {
  static title = 'Fórmula de Euler para el triángulo';
  static route = 'euler-triangle-formula';
}
