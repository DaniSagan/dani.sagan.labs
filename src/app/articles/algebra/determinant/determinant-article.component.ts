import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { DeterminantPlaneComponent } from '../../../widgets/determinant/determinant-plane.component';
import { DeterminantVolumeComponent } from '../../../widgets/determinant/determinant-volume.component';
import { DeterminantExpansionComponent } from '../../../widgets/determinant/determinant-expansion.component';
import { DeterminantEliminationComponent } from '../../../widgets/determinant/determinant-elimination.component';

@Component({
  selector: 'app-determinant-article',
  standalone: true,
  imports: [
    FormulaComponent,
    DeterminantPlaneComponent,
    DeterminantVolumeComponent,
    DeterminantExpansionComponent,
    DeterminantEliminationComponent,
  ],
  templateUrl: './determinant-article.component.html',
  styles: [
    ':host{display:block;min-width:0}app-formula{display:block;max-width:100%;overflow-x:auto;margin:1rem 0}',
  ],
})
export class DeterminantArticleComponent {
  static title = 'El determinante: área, volumen y orientación';
  static route = 'matrix-determinant';
}
