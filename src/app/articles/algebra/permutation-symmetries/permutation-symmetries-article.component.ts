import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-permutation-symmetries-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './permutation-symmetries-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class PermutationSymmetriesArticleComponent {
 static title = "Permutaciones, ciclos y grupos de simetrías";
 static route = 'permutation-symmetries';
}
