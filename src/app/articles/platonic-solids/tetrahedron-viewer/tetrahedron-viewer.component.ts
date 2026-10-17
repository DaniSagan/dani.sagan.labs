import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PolyhedronLabComponent } from '../polyhedron-lab.component';
import { TETRAHEDRON } from '../platonic-models';

@Component({
  selector: 'app-tetrahedron-viewer',
  standalone: true,
  imports: [RouterLink, FormulaComponent, PolyhedronLabComponent],
  templateUrl: './tetrahedron-viewer.component.html',
  styleUrl: '../platonic-article.css',
})
export class TetrahedronViewerComponent {
  static title = 'Tetraedro regular';
  static route = 'tetrahedron-viewer';
  readonly solid = TETRAHEDRON;
}
