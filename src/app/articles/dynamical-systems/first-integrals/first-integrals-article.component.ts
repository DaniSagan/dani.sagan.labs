import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './first-integrals-lab.model';
@Component({
    selector: 'app-first-integrals-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './first-integrals-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class FirstIntegralsArticleComponent {
    readonly lab = lab;
    static readonly title = "Integrales primeras y cantidades conservadas";
    static readonly route = 'first-integrals';
}
