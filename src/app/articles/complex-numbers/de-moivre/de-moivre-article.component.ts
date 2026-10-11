import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-de-moivre-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './de-moivre-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class DeMoivreArticleComponent {
 static title = "Fórmula de De Moivre: potencias y raíces complejas";
 static route = 'de-moivre';
}
