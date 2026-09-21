import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { cycloidPoint } from '../../shared/math/brachistochrone';

@Component({
  selector: 'app-cycloid-construction', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './cycloid-construction.component.html', styleUrl: './brachistochrone-widgets.css'
})
export class CycloidConstructionComponent {
  theta = 3.14;
  radius = 1;
  readonly pi = Math.PI;
  readonly scale = 100;
  readonly fullPath = this.path(2 * Math.PI);
  get point() { return cycloidPoint(this.radius, this.theta); }
  get px(): number { return 65 + this.scale * (this.theta - Math.sin(this.theta)); }
  get py(): number { return 48 + this.scale * (1 - Math.cos(this.theta)); }
  get cx(): number { return 65 + this.scale * this.theta; }
  get trace(): string { return this.path(this.theta); }
  get travelTime(): number { return this.theta * Math.sqrt(this.radius / 9.81); }
  path(end: number): string {
    return Array.from({ length: 201 }, (_, i) => {
      const p = cycloidPoint(this.scale, end * i / 200);
      return `${i ? 'L' : 'M'}${65 + p.x},${48 + p.y}`;
    }).join(' ');
  }
}
