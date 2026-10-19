import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-euler-conjecture-counterexample', standalone: true, imports: [RouterLink], templateUrl: './euler-conjecture-counterexample.component.html', styleUrls: ['../../shared/learning-article.css', './euler-conjecture-counterexample.component.css'] })
export class EulerConjectureCounterexampleComponent {
  static readonly title = "Dos frases contra una conjetura de Euler";
  static readonly route = 'euler-conjecture-counterexample';
}
