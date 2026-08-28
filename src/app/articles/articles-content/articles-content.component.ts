import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ArticlesNavbarComponent } from '../articles-navbar/articles-navbar.component';
import { MobileSidebarComponent } from 'src/app/shared/mobile-sidebar/mobile-sidebar.component';

@Component({
  selector: 'app-articles-content',
  templateUrl: './articles-content.component.html',
  styleUrl: './articles-content.component.css',
  standalone: true,
  imports: [ArticlesNavbarComponent, RouterOutlet, MobileSidebarComponent],
})
export class ArticlesContentComponent {}
