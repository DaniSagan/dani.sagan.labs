import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-hardy-ramanujan-taxicab', standalone: true, imports: [RouterLink],
  templateUrl: './hardy-ramanujan-taxicab.component.html',
  styleUrls: ['../../shared/learning-article.css', '../gauss-school-sum/gauss-school-sum.component.css'],
})
export class HardyRamanujanTaxicabComponent {
  static readonly title = 'Hardy, Ramanujan y el taxi menos aburrido del mundo';
  static readonly route = 'hardy-ramanujan-taxicab';
}
