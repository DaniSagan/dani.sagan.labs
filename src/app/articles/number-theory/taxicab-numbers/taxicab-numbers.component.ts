import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-taxicab-numbers', standalone: true, imports: [CommonModule, RouterLink],
  templateUrl: './taxicab-numbers.component.html',
  styleUrls: ['../../shared/learning-article.css', './taxicab-numbers.component.css'],
})
export class TaxicabNumbersComponent {
  static readonly title = 'Números taxicab: dos sumas de cubos y el caso 1729';
  static readonly route = 'taxicab-numbers';
  readonly candidates = Array.from({ length: 12 }, (_, j) => j + 1).flatMap(b =>
    Array.from({ length: b }, (_, i) => ({ a: i + 1, b, sum: (i + 1) ** 3 + b ** 3 }))
      .filter(pair => pair.sum <= 1729)
  ).sort((x, y) => x.sum - y.sum || x.a - y.a);
  readonly collisions = this.candidates.filter((pair, i, all) =>
    all.some((other, j) => j !== i && other.sum === pair.sum));
}
