import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-life-patterns-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './life-patterns-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class LifePatternsArticleComponent {
 static title = "El Juego de la vida: osciladores y evolución";
 static route = 'life-patterns';
}
