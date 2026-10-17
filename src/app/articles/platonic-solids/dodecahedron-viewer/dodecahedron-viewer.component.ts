import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PolyhedronLabComponent } from '../polyhedron-lab.component';
import { DODECAHEDRON } from '../platonic-models';

@Component({
  selector: 'app-dodecahedron-viewer',
  standalone: true,
  imports: [RouterLink, FormulaComponent, PolyhedronLabComponent],
  templateUrl: './dodecahedron-viewer.component.html',
  styleUrl: '../platonic-article.css',
})
export class DodecahedronViewerComponent {
  static title = 'Dodecaedro regular';
  static route = 'dodecahedron-viewer';
  readonly solid = DODECAHEDRON;
}
