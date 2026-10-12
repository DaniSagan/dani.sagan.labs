import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './normal-distribution-lab.model';
@Component({
    selector: 'app-normal-distribution-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './normal-distribution-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class NormalDistributionArticleComponent {
    readonly lab = lab;
    static readonly title = "Distribución normal y tipificación";
    static readonly route = 'normal-distribution';
}
