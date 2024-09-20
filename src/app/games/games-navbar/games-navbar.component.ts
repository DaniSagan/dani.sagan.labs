import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-games-navbar',
  templateUrl: './games-navbar.component.html',
  styleUrl: './games-navbar.component.css',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class GamesNavbarComponent {}
