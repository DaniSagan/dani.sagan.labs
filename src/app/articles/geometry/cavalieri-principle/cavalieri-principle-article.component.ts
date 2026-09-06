import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-cavalieri-principle-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './cavalieri-principle-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class CavalieriPrincipleArticleComponent {
  static title = 'Principio de Cavalieri';
  static route = 'cavalieri-principle';
}
