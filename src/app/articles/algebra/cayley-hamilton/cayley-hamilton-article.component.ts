import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-cayley-hamilton-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './cayley-hamilton-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class CayleyHamiltonArticleComponent {
 static title = "Teorema de Cayley–Hamilton y polinomio mínimo";
 static route = 'cayley-hamilton';
}
