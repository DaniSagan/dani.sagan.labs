import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-nightingale-statistical-campaign', standalone: true, imports: [RouterLink], templateUrl: './nightingale-statistical-campaign.component.html', styleUrls: ['../../shared/learning-article.css', './nightingale-statistical-campaign.component.css'] })
export class NightingaleStatisticalCampaignComponent {
  static readonly title = "Nightingale: el gráfico que llevó el hospital a los despachos";
  static readonly route = 'nightingale-statistical-campaign';
}
