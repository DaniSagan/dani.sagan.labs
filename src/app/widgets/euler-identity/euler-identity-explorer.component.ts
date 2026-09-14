import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-euler-identity-explorer', standalone: true, imports: [CommonModule, FormsModule],
  templateUrl: './euler-identity-explorer.component.html', styleUrl: './euler-identity-explorer.component.css'
})
export class EulerIdentityExplorerComponent {
  turns = 1; // Angle in multiples of pi, so presets retain exact quarter turns.
  readonly presets = [-1, 0, 0.5, 1, 1.5, 2, 3];
  get angle(): number { return this.turns * Math.PI; }
  get exact(): boolean { return Number.isInteger(this.turns * 2); }
  get real(): number {
    if (this.exact) return [1, 0, -1, 0][((this.turns * 2) % 4 + 4) % 4];
    return Math.cos(this.angle);
  }
  get imaginary(): number {
    if (this.exact) return [0, 1, 0, -1][((this.turns * 2) % 4 + 4) % 4];
    return Math.sin(this.angle);
  }
  get isZero(): boolean { return this.exact && this.real === -1; }
  get arc(): string {
    const steps = Math.max(1, Math.ceil(Math.abs(this.turns) * 64));
    return Array.from({ length: steps + 1 }, (_, index) => {
      const angle = this.angle * index / steps;
      return `${index ? 'L' : 'M'}${this.x(Math.cos(angle))},${this.y(Math.sin(angle))}`;
    }).join(' ');
  }
  x(real: number): number { return 210 + 120 * real; }
  y(imaginary: number): number { return 175 - 120 * imaginary; }
  format(value: number): string { return value.toLocaleString('es-ES', { maximumFractionDigits: 6 }); }
}
