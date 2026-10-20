import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-turing-chained-mug', standalone: true, imports: [RouterLink], templateUrl: './turing-chained-mug.component.html', styleUrls: ['../../shared/learning-article.css', './turing-chained-mug.component.css'] })
export class TuringChainedMugComponent {
  static readonly title = "Alan Turing y la taza que no debía desaparecer";
  static readonly route = 'turing-chained-mug';
}
