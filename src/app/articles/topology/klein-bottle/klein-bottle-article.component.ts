import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { KleinBottleViewerComponent } from '../../../widgets/klein-bottle/klein-bottle-viewer.component';
import { KleinGluingComponent } from '../../../widgets/klein-bottle/klein-gluing.component';

@Component({
  selector: 'app-klein-bottle-article', standalone: true,
  imports: [RouterLink, FormulaComponent, KleinBottleViewerComponent, KleinGluingComponent],
  templateUrl: './klein-bottle-article.component.html'
})
export class KleinBottleArticleComponent {
  static title = 'La botella de Klein';
  static route = 'klein-bottle';
}
