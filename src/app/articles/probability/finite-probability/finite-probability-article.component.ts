import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './finite-probability-lab.model';
@Component({
    selector: 'app-finite-probability-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './finite-probability-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class FiniteProbabilityArticleComponent {
    readonly lab = lab;
    static readonly title = "Probabilidad en espacios finitos: sucesos y regla de Laplace";
    static readonly route = 'finite-probability';
}
