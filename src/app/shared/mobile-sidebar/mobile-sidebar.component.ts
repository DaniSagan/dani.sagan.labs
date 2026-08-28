import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mobile-sidebar',
  standalone: true,
  templateUrl: './mobile-sidebar.component.html',
  styleUrls: ['./mobile-sidebar.component.css'],
})
export class MobileSidebarComponent {
  @Input() toggleId = 'sidebar-toggle';
}
