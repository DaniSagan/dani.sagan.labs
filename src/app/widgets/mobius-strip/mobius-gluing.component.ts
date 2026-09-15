import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { seamPartner } from './mobius-strip.math';

@Component({
  selector: 'app-mobius-gluing', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './mobius-gluing.component.html', styleUrls: ['./mobius-strip.css']
})
export class MobiusGluingComponent {
  twisted = true;
  v = 0.6;
  get partner() { return seamPartner(this.v, this.twisted); }
  y(v: number) { return 135 - 85 * v; }
}
