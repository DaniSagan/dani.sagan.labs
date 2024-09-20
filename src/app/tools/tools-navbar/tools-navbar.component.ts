import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-tools-navbar',
  templateUrl: './tools-navbar.component.html',
  styleUrl: './tools-navbar.component.css',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class ToolsNavbarComponent {}
