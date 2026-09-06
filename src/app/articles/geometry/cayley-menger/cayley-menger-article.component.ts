import { Component } from '@angular/core';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { GeometryDiagramComponent } from '../shared/geometry-diagram.component';

@Component({
  selector: 'app-cayley-menger-article',
  standalone: true,
  imports: [FormulaComponent, GeometryDiagramComponent],
  templateUrl: './cayley-menger-article.component.html',
  styleUrl: '../shared/geometry-article.css'
})
export class CayleyMengerArticleComponent {
  static title = 'Volumen del tetraedro: Tartaglia y Cayley–Menger';
  static route = 'cayley-menger';
}
