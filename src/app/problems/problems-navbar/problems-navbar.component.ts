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

}
