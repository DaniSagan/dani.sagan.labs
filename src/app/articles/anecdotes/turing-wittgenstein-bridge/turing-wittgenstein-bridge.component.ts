import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-turing-wittgenstein-bridge', standalone: true, imports: [RouterLink], templateUrl: './turing-wittgenstein-bridge.component.html', styleUrls: ['../../shared/learning-article.css', './turing-wittgenstein-bridge.component.css'] })
export class TuringWittgensteinBridgeComponent {
  static readonly title = "Turing y Wittgenstein: una discusión con un puente en medio";
  static readonly route = 'turing-wittgenstein-bridge';
}
