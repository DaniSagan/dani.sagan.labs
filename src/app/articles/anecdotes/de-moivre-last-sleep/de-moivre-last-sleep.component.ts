import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-de-moivre-last-sleep', standalone: true, imports: [RouterLink], templateUrl: './de-moivre-last-sleep.component.html', styleUrls: ['../../shared/learning-article.css', './de-moivre-last-sleep.component.css'] })
export class DeMoivreLastSleepComponent {
  static readonly title = "De Moivre y la última cuenta del sueño";
  static readonly route = 'de-moivre-last-sleep';
}
