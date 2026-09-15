import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { kleinTraveler } from './klein-bottle.math';

@Component({
  selector: 'app-klein-gluing', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './klein-gluing.component.html', styleUrls: ['./klein-bottle.css']
})
export class KleinGluingComponent {
  twisted = true;
  height = 0.25;
  distance = 0;
  get traveler() { return kleinTraveler(this.distance, this.height, this.twisted); }
  x(u: number) { return 80 + 400 * u; }
  y(v: number) { return 235 - 180 * v; }
  get arrow() {
    const x = this.x(this.traveler.u), y = this.y(this.traveler.v), direction = this.traveler.flipped ? 1 : -1;
    return `M${x},${y} v${direction * 28} m-5,${-direction * 7} l5,${direction * 7} l5,${-direction * 7}`;
  }
}
