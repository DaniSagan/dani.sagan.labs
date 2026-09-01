import { Component } from '@angular/core';
import { NavbarSubsection } from 'src/app/shared/content/navbar-subsection';
import { SectionNavbarComponent } from 'src/app/shared/section-navbar/section-navbar.component';

@Component({
  selector: 'app-problems-navbar',
  standalone: true,
  imports: [SectionNavbarComponent],
  templateUrl: './problems-navbar.component.html',
  styleUrl: './problems-navbar.component.css'
})
export class ProblemsNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-problems';
  readonly sections: NavbarSubsection[] = [{
    name: 'Otros',
    items: [{ name: 'Problema 1', route: 'test-problem' }]
  }];
}
