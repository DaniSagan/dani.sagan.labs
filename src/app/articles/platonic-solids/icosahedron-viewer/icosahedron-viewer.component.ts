import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from 'src/app/shared/math/formula/formula.component';
import { PolyhedronLabComponent } from '../polyhedron-lab.component';
import { ICOSAHEDRON } from '../platonic-models';

@Component({
  selector: 'app-icosahedron-viewer',
  standalone: true,
  imports: [RouterLink, FormulaComponent, PolyhedronLabComponent],
  templateUrl: './icosahedron-viewer.component.html',
  styleUrl: '../platonic-article.css',
})
export class IcosahedronViewerComponent {
  static title = 'Icosaedro regular';
  static route = 'icosahedron-viewer';
  readonly solid = ICOSAHEDRON;
}
