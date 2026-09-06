import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-euler-polyhedron-formula-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './euler-polyhedron-formula-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class EulerPolyhedronFormulaArticleComponent {
  static title = 'Fórmula de Euler para poliedros';
  static route = 'euler-polyhedron-formula';
}
