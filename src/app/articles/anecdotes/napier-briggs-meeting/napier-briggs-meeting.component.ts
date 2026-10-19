import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-napier-briggs-meeting', standalone: true, imports: [RouterLink], templateUrl: './napier-briggs-meeting.component.html', styleUrls: ['../../shared/learning-article.css', './napier-briggs-meeting.component.css'] })
export class NapierBriggsMeetingComponent {
  static readonly title = "El visitante que dejó a Napier sin conversación";
  static readonly route = 'napier-briggs-meeting';
}
