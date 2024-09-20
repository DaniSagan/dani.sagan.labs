import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolsNavbarComponent } from '../tools-navbar/tools-navbar.component';

@Component({
  selector: 'app-tools-content',
  templateUrl: './tools-content.component.html',
  styleUrl: './tools-content.component.css',
  standalone: true,
  imports: [ToolsNavbarComponent, RouterOutlet],
})
export class ToolsContentComponent {}
