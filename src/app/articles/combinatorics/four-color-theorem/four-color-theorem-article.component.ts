import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormulaComponent } from '../../../shared/math/formula/formula.component';
import { FourColorEditorComponent } from '../../../widgets/four-color/four-color-editor.component';
import { FourColorSearchComponent } from '../../../widgets/four-color/four-color-search.component';
import { FourColorKempeComponent } from '../../../widgets/four-color/four-color-kempe.component';

@Component({
  selector: 'app-four-color-theorem-article',
  standalone: true,
  imports: [
    RouterModule,
    FormulaComponent,
    FourColorEditorComponent,
    FourColorSearchComponent,
    FourColorKempeComponent,
  ],
  templateUrl: './four-color-theorem-article.component.html',
  styleUrl: './four-color-theorem-article.component.css',
})
export class FourColorTheoremArticleComponent {
  static title = 'El teorema de los cuatro colores';
  static route = 'four-color-theorem';
}
