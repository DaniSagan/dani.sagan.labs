import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-height-surveying-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './height-surveying-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class HeightSurveyingArticleComponent {
 static title = "Trigonometría para medir alturas y distancias";
 static route = 'height-surveying';
}
