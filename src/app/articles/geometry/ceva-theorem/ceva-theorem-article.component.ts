import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-ceva-theorem-article',
  standalone: true,
  imports: [RouterLink, FormulaComponent, GeometryDiagramComponent],
  templateUrl: './ceva-theorem-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class CevaTheoremArticleComponent {
  static title = 'Teorema de Ceva';
  static route = 'ceva-theorem';
}
