import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-discrete-expectation-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './discrete-expectation-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class DiscreteExpectationArticleComponent {
 static title = "Esperanza discreta, juegos justos y riesgo";
 static route = 'discrete-expectation';
}
