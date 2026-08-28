import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-games-navbar',
  templateUrl: './games-navbar.component.html',
  styleUrl: './games-navbar.component.css',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class GamesNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-games';

  closeSidebar(): void {
    const checkbox = document.getElementById(this.sidebarId) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}
