import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-fermat-point-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './fermat-point-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class FermatPointArticleComponent {
  static title = 'El punto de Fermat o Torricelli';
  static route = 'fermat-point';
}
