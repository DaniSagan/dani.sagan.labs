import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tools-navbar',
  templateUrl: './tools-navbar.component.html',
  styleUrl: './tools-navbar.component.css',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class ToolsNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-tools';

  closeSidebar(): void {
    const checkbox = document.getElementById(this.sidebarId) as HTMLInputElement | null;
    if (checkbox) {
      checkbox.checked = false;
    }
  }
}
