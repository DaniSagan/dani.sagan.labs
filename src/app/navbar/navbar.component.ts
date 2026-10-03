import { Component, inject } from '@angular/core';
import { IdlePreloadingStrategy } from '../shared/navigation/idle-preloading.strategy';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class NavbarComponent {
  readonly preloading = inject(IdlePreloadingStrategy);
}
