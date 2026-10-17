import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PolyhedronLabComponent } from '../polyhedron-lab.component';
import { OCTAHEDRON } from '../platonic-models';

@Component({
  selector: 'app-octahedron-viewer',
  standalone: true,
  imports: [RouterLink, FormulaComponent, PolyhedronLabComponent],
  templateUrl: './octahedron-viewer.component.html',
  styleUrl: '../platonic-article.css',
})
export class OctahedronViewerComponent {
  static title = 'Octaedro regular';
  static route = 'octahedron-viewer';
  readonly solid = OCTAHEDRON;
}
