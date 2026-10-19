import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-mobius-listing-strip', standalone: true, imports: [RouterLink], templateUrl: './mobius-listing-strip.component.html', styleUrls: ['../../shared/learning-article.css', './mobius-listing-strip.component.css'] })
export class MobiusListingStripComponent {
  static readonly title = "Una cinta con dos descubridores";
  static readonly route = 'mobius-listing-strip';
}
