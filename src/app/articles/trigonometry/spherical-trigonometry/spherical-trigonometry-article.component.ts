import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-spherical-trigonometry-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './spherical-trigonometry-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class SphericalTrigonometryArticleComponent {
  static readonly title = "Trigonometría esférica y coordenadas celestes";
  static readonly route = "spherical-trigonometry";
}
