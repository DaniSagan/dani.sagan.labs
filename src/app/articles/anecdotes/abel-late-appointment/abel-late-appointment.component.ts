import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({ selector: 'app-abel-late-appointment', standalone: true, imports: [RouterLink], templateUrl: './abel-late-appointment.component.html', styleUrls: ['../../shared/learning-article.css', './abel-late-appointment.component.css'] })
export class AbelLateAppointmentComponent {
  static readonly title = "El puesto que llegó después de Abel";
  static readonly route = 'abel-late-appointment';
}
