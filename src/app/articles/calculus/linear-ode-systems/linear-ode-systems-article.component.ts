import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { MathLabComponent } from '../../shared/math-lab.component';
import { lab } from './linear-ode-systems-lab.model';
@Component({
    selector: 'app-linear-ode-systems-article', standalone: true,
    imports: [...LEARNING_IMPORTS, MathLabComponent],
    templateUrl: './linear-ode-systems-article.component.html',
    styleUrls: ['../../shared/learning-article.css'],
})
export class LinearOdeSystemsArticleComponent {
    readonly lab = lab;
    static readonly title = "Sistemas diferenciales lineales y exponencial de matrices";
    static readonly route = 'linear-ode-systems';
}
