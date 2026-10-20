import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-noether-gottingen-lectures', standalone: true, imports: [RouterLink], templateUrl: './noether-gottingen-lectures.component.html', styleUrls: ['../../shared/learning-article.css', './noether-gottingen-lectures.component.css'] })
export class NoetherGottingenLecturesComponent {
  static readonly title = "Emmy Noether: la profesora cuyo curso anunciaba Hilbert";
  static readonly route = 'noether-gottingen-lectures';
}
