import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-grothendieck-ihes-departure', standalone: true, imports: [RouterLink], templateUrl: './grothendieck-ihes-departure.component.html', styleUrls: ['../../shared/learning-article.css', './grothendieck-ihes-departure.component.css'] })
export class GrothendieckIhesDepartureComponent {
  static readonly title = "Grothendieck: el presupuesto que le hizo abandonar el IHÉS";
  static readonly route = 'grothendieck-ihes-departure';
}
