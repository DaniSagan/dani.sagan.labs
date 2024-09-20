import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ArticlesNavbarComponent } from '../articles-navbar/articles-navbar.component';

@Component({
  selector: 'app-articles-content',
  templateUrl: './articles-content.component.html',
  styleUrl: './articles-content.component.css',
  // standalone: true,
  // imports: [ RouterModule ]
  standalone: true,
  imports: [ArticlesNavbarComponent, RouterOutlet],
})
export class ArticlesContentComponent {}
