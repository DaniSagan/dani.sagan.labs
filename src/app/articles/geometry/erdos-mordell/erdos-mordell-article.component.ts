import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-erdos-mordell-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './erdos-mordell-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class ErdosMordellArticleComponent {
  static title = 'La desigualdad de Erdős–Mordell';
  static route = 'erdos-mordell';
}
