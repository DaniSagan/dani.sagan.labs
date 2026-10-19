import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-dantzig-homework', standalone: true, imports: [RouterLink], templateUrl: './dantzig-homework.component.html', styleUrls: ['../../shared/learning-article.css', './dantzig-homework.component.css'] })
export class DantzigHomeworkComponent {
  static readonly title = "Los deberes que no eran deberes";
  static readonly route = 'dantzig-homework';
}
