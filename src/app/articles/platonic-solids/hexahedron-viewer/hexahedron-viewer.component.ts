import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PolyhedronLabComponent } from '../polyhedron-lab.component';
import { HEXAHEDRON } from '../platonic-models';

@Component({
  selector: 'app-hexahedron-viewer',
  standalone: true,
  imports: [RouterLink, FormulaComponent, PolyhedronLabComponent],
  templateUrl: './hexahedron-viewer.component.html',
  styleUrl: '../platonic-article.css',
})
export class HexahedronViewerComponent {
  static title = 'Cubo o hexaedro regular';
  static route = 'hexahedron-viewer';
  readonly solid = HEXAHEDRON;
}
