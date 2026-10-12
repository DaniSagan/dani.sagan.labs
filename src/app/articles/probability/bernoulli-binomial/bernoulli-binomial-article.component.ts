import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './bernoulli-binomial-lab.model';
@Component({
    selector: 'app-bernoulli-binomial-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './bernoulli-binomial-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class BernoulliBinomialArticleComponent {
    readonly lab = lab;
    static readonly title = "Distribuciones de Bernoulli y binomial";
    static readonly route = 'bernoulli-binomial';
}
