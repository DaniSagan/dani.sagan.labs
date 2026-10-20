import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-chatelet-newton-translation', standalone: true, imports: [RouterLink], templateUrl: './chatelet-newton-translation.component.html', styleUrls: ['../../shared/learning-article.css', './chatelet-newton-translation.component.css'] })
export class ChateletNewtonTranslationComponent {
  static readonly title = "Émilie du Châtelet: Newton contra el reloj";
  static readonly route = 'chatelet-newton-translation';
}
