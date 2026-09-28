import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-shoelace-formula-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, GeometryDiagramComponent],
  templateUrl: './shoelace-formula-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class ShoelaceFormulaArticleComponent {
  static title = 'Fórmula del área de Gauss';
  static route = 'shoelace-formula';
}
