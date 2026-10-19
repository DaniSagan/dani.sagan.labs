import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-hilbert-hotel', standalone: true, imports: [RouterLink], templateUrl: './hilbert-hotel.component.html', styleUrls: ['../../shared/learning-article.css', './hilbert-hotel.component.css'] })
export class HilbertHotelComponent {
  static readonly title = "Habitaciones libres en un hotel lleno";
  static readonly route = 'hilbert-hotel';
}
