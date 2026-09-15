import { Component } from '@angular/core';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { MobiusStripViewerComponent } from '../../../widgets/mobius-strip/mobius-strip-viewer.component';
import { MobiusGluingComponent } from '../../../widgets/mobius-strip/mobius-gluing.component';

@Component({
  selector: 'app-mobius-strip-article', standalone: true,
  imports: [FormulaComponent, MobiusStripViewerComponent, MobiusGluingComponent],
  templateUrl: './mobius-strip-article.component.html'
})
export class MobiusStripArticleComponent {
  static title = 'La cinta de Möbius';
  static route = 'mobius-strip';
}
