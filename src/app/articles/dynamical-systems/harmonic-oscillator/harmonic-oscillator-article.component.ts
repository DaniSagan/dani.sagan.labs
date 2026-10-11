import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { TopicLabComponent } from '../../shared/topic-lab.component';
@Component({ selector: 'app-harmonic-oscillator-article', standalone: true, imports: [...LEARNING_IMPORTS, TopicLabComponent], templateUrl: './harmonic-oscillator-article.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class HarmonicOscillatorArticleComponent {
 static title = "Oscilador armónico y retratos de fase";
 static route = 'harmonic-oscillator';
}
