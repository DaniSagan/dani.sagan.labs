import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-problems-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './problems-navbar.component.html',
  styleUrl: './problems-navbar.component.css'
})
export class ProblemsNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-problems';

  closeSidebar(): void {
    const checkbox = document.getElementById(this.sidebarId) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}
