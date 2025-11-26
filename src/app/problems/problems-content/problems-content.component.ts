import { Component } from '@angular/core';
import { ProblemsNavbarComponent } from '../problems-navbar/problems-navbar.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-problems-content',
  standalone: true,
  imports: [ProblemsNavbarComponent, RouterOutlet],
  templateUrl: './problems-content.component.html',
  styleUrl: './problems-content.component.css'
})
export class ProblemsContentComponent {

}
