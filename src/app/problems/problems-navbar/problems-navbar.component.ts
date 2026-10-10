import { Component } from '@angular/core';
import { PROBLEM_NAVIGATION } from '../problems.data';
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
  readonly sections = PROBLEM_NAVIGATION;
}
