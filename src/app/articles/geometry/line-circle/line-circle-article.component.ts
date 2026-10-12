import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './line-circle-lab.model';
@Component({
    selector: 'app-line-circle-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './line-circle-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class LineCircleArticleComponent {
    readonly lab = lab;
    static readonly title = "Geometría analítica de la recta y la circunferencia";
    static readonly route = 'line-circle';
}
