import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-imaginary-power-branches', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './imaginary-power-branches.component.html', styleUrl: './imaginary-power.css'
})
export class ImaginaryPowerBranchesComponent {
  k = 0;
  readonly branches = [-3, -2, -1, 0, 1, 2, 3];
  angle(k: number): number { return Math.PI / 2 + 2 * Math.PI * k; }
  value(k: number): number { return Math.exp(-this.angle(k)); }
  x(k: number): number { return 300 - this.angle(k) * 11; }
  format(n: number): string { return n.toLocaleString('es-ES', { maximumSignificantDigits: 8 }); }
}
