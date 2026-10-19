import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-hamilton-broom-bridge', standalone: true, imports: [RouterLink], templateUrl: './hamilton-broom-bridge.component.html', styleUrls: ['../../shared/learning-article.css', './hamilton-broom-bridge.component.css'] })
export class HamiltonBroomBridgeComponent {
  static readonly title = "La fórmula que Hamilton dejó en un puente";
  static readonly route = 'hamilton-broom-bridge';
}
