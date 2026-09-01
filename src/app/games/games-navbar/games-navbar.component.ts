import { Component } from '@angular/core';
import { NavbarSubsection } from 'src/app/shared/content/navbar-subsection';
import { SectionNavbarComponent } from 'src/app/shared/section-navbar/section-navbar.component';

@Component({
  selector: 'app-games-navbar',
  templateUrl: './games-navbar.component.html',
  styleUrl: './games-navbar.component.css',
  standalone: true,
  imports: [SectionNavbarComponent],
})
export class GamesNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-games';
  readonly sections: NavbarSubsection[] = [{
    name: 'Otros',
    items: [
      { name: 'Tres en Raya', route: 'tic-tac-toe' },
      { name: 'Cuatro en Raya', route: 'four-in-a-row' },
      { name: 'Juego de la Vida de Conway', route: 'game-of-life' },
      { name: 'Cubo de Rubik', route: 'rubik-cube' },
      { name: 'Sudoku', route: 'sudoku' }
    ]
  }];
}
