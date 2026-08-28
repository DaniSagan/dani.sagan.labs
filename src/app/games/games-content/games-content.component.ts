import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GamesNavbarComponent } from '../games-navbar/games-navbar.component';
import { MobileSidebarComponent } from 'src/app/shared/mobile-sidebar/mobile-sidebar.component';

@Component({
  selector: 'app-games-content',
  templateUrl: './games-content.component.html',
  styleUrl: './games-content.component.css',
  standalone: true,
  imports: [GamesNavbarComponent, RouterOutlet, MobileSidebarComponent],
})
export class GamesContentComponent {}
