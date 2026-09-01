import { Component } from '@angular/core';
import { NavbarSubsection } from 'src/app/shared/content/navbar-subsection';
import { SectionNavbarComponent } from 'src/app/shared/section-navbar/section-navbar.component';

@Component({
  selector: 'app-tools-navbar',
  templateUrl: './tools-navbar.component.html',
  styleUrl: './tools-navbar.component.css',
  standalone: true,
  imports: [SectionNavbarComponent],
})
export class ToolsNavbarComponent {
  readonly sidebarId = 'sidebar-toggle-tools';
  readonly sections: NavbarSubsection[] = [{
    name: 'Otros',
    items: [
      { name: 'Factorización en primos', route: 'prime-decomposition' },
      { name: 'Graficador de funciones', route: 'graph-plotter' },
      { name: 'Calculadora de decimales de pi', route: 'pi-decimals' },
      { name: 'Graficador de curvas implícitas', route: 'implicit-curve-graph' },
      { name: 'Calculadora de posición solar', route: 'sun-position' },
      { name: 'Planificador de viajes', route: 'travel-planner' }
    ]
  }];
}
