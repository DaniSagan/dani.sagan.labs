import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-zeno-achilles-tortoise', standalone: true, imports: [RouterLink], templateUrl: './zeno-achilles-tortoise.component.html', styleUrls: ['../../shared/learning-article.css', './zeno-achilles-tortoise.component.css'] })
export class ZenoAchillesTortoiseComponent {
  static readonly title = "La tortuga que siempre llevaba ventaja";
  static readonly route = 'zeno-achilles-tortoise';
}
