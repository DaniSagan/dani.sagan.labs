import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './moment-transformations-lab.model';
@Component({
    selector: 'app-moment-transformations-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './moment-transformations-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class MomentTransformationsArticleComponent {
    readonly lab = lab;
    static readonly title = "Transformaciones de variables y de sus momentos";
    static readonly route = 'moment-transformations';
}
