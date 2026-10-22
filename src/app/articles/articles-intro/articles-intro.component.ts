import { RandomDiscoveryComponent } from '../../shared/random-discovery/random-discovery.component';
import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  selector: 'app-articles-intro',
  standalone: true,
  imports: [RandomDiscoveryComponent, RouterLink],
  templateUrl: './articles-intro.component.html',
  styleUrl: './articles-intro.component.css',
})
export class ArticlesIntroComponent {}
