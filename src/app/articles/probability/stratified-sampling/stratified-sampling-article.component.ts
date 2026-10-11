import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { DeepExplorerComponent } from '../../shared/deep-explorer.component';
@Component({
  selector: 'app-stratified-sampling-article', standalone: true,
  imports: [...LEARNING_IMPORTS, DeepExplorerComponent],
  templateUrl: './stratified-sampling-article.component.html',
  styleUrls: ['../../shared/learning-article.css']
})
export class StratifiedSamplingArticleComponent {
  static readonly title = "Muestreo estratificado y estimadores ponderados";
  static readonly route = "stratified-sampling";
}
