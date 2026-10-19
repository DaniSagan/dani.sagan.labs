import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-mandelbrot-coastline', standalone: true, imports: [RouterLink], templateUrl: './mandelbrot-coastline.component.html', styleUrls: ['../../shared/learning-article.css', './mandelbrot-coastline.component.css'] })
export class MandelbrotCoastlineComponent {
  static readonly title = "La costa que cambiaba de longitud";
  static readonly route = 'mandelbrot-coastline';
}
