import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-menelaus-theorem-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, GeometryDiagramComponent],
  templateUrl: './menelaus-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class MenelausTheoremArticleComponent {
  static title = 'Teorema de Menelao';
  static route = 'menelaus-theorem';
}
