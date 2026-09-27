import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gcd-invariance', standalone: true, imports: [FormsModule],
  template: `
    <div class="widget" aria-labelledby="invariance-title">
      <span class="eyebrow">EXPERIMENTA ANTES DE DEMOSTRAR</span>
      <h3 id="invariance-title">¿Qué cambia al sumar un múltiplo?</h3>
      <div class="controls">
        <label for="invariance-a">a (1–120)<input id="invariance-a" type="number" min="1" max="120" step="1" [(ngModel)]="a"></label>
        <label for="invariance-b">b (1–120)<input id="invariance-b" type="number" min="1" max="120" step="1" [(ngModel)]="b"></label>
        <label for="invariance-k">k = {{ k }}<input id="invariance-k" type="range" min="-5" max="5" step="1" [(ngModel)]="k"></label>
      </div>
      @if (!valid) { <p role="alert" class="error">Introduce dos enteros entre 1 y 120.</p> }
      @else {
        <div aria-live="polite">
          <p>Divisores positivos comunes de {{ a }} y {{ b }}:</p>
          <div class="chips">@for (d of common(a, b); track d) {
            <span class="chip" [class.maximum]="$last">{{ d }}{{ $last ? ' · MCD' : '' }}</span>
          }</div>
          <p>Divisores positivos comunes de a + kb = {{ shifted }} y b = {{ b }}:</p>
          <div class="chips">@for (d of common(shifted, b); track d) {
            <span class="chip" [class.maximum]="$last">{{ d }}{{ $last ? ' · MCD' : '' }}</span>
          }</div>
        </div>
        <p class="note">Mueve k, incluso hasta que a + kb sea negativo o cero. ¿Solo se conserva el mayor divisor, o toda la colección? La prueba del lema de Euclides explicará lo que observas.</p>
      }
    </div>`,
  styleUrl: './euclid-widgets.css'
})
export class GcdInvarianceComponent {
  a = 48;
  b = 18;
  k = -2;
  get valid(): boolean { return [this.a, this.b].every(n => Number.isInteger(n) && n >= 1 && n <= 120); }
  get shifted(): number { return this.a + this.k * this.b; }
  common(a: number, b: number): number[] {
    return Array.from({ length: b }, (_, i) => i + 1).filter(d => a % d === 0 && b % d === 0);
  }
}
