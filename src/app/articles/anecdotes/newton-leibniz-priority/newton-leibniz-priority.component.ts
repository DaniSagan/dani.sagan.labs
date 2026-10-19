import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-newton-leibniz-priority', standalone: true, imports: [RouterLink], templateUrl: './newton-leibniz-priority.component.html', styleUrls: ['../../shared/learning-article.css', './newton-leibniz-priority.component.css'] })
export class NewtonLeibnizPriorityComponent {
  static readonly title = "Newton y Leibniz: un cálculo y dos prioridades";
  static readonly route = 'newton-leibniz-priority';
}
