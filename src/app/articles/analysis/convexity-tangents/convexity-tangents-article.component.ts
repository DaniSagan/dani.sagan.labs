import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-convexity-tangents-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './convexity-tangents-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class ConvexityTangentsArticleComponent {
 static title = "Convexidad, concavidad y desigualdades";
 static route = 'convexity-tangents';
}
