import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-frobenius-coins-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './frobenius-coins-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class FrobeniusCoinsArticleComponent {
 static title = "El problema de las monedas y el número de Frobenius";
 static route = 'frobenius-coins';
}
