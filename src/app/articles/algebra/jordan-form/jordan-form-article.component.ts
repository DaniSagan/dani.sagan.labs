import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-jordan-form-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './jordan-form-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class JordanFormArticleComponent {
 static title = "Forma de Jordan, nilpotencia y potencias de matrices";
 static route = 'jordan-form';
}
