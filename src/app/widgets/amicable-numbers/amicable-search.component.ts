import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { findAmicablePairs } from '../../shared/math/amicable-numbers';

@Component({
  selector: 'app-amicable-search', standalone: true, imports: [CommonModule, FormsModule],
  styleUrl: './amicable-widgets.css',
  template: `
    <section class="widget" aria-labelledby="amicable-search-title">
      <h3 id="amicable-search-title">Buscar parejas</h3>
      <p>Busca todas las parejas cuyos dos miembros estén entre 1 y el límite elegido. Cada pareja aparece una sola vez.</p>
      <form (ngSubmit)="search()"><label for="amicable-limit">Límite (1–100000)</label>
        <div class="controls"><input id="amicable-limit" name="limit" type="number" min="1" max="100000" step="1" required [(ngModel)]="input">
          <button type="submit">Buscar</button></div></form>
      <p class="error" role="alert" *ngIf="error">{{ error }}</p>
      <ng-container *ngIf="searched">
        <p aria-live="polite">{{ pairs.length }} parejas con ambos números ≤ {{ limit }}.</p>
        <p *ngIf="!pairs.length">No hay parejas completas en este intervalo.</p>
        <div class="table-scroll" *ngIf="pairs.length"><table><caption>Parejas encontradas</caption>
          <thead><tr><th scope="col">a</th><th scope="col">b = s(a)</th><th scope="col">s(b)</th></tr></thead>
          <tbody><tr *ngFor="let pair of pairs"><td>{{ pair[0] }}</td><td>{{ pair[1] }}</td><td>{{ pair[0] }}</td></tr></tbody>
        </table></div>
      </ng-container>
      <p class="note">Por ejemplo, un límite de 250 no incluye la pareja 220–284 porque su segundo miembro queda fuera.</p>
    </section>`
})
export class AmicableSearchComponent {
  input: number | null = 10000; limit = 10000; error = ''; searched = false;
  pairs: [number, number][] = [];
  constructor() { this.search(); }
  search(): void {
    this.error = ''; this.searched = false; this.pairs = [];
    try {
      if (this.input === null) throw new Error('Introduce un límite.');
      this.pairs = findAmicablePairs(this.input); this.limit = this.input; this.searched = true;
    } catch (error) { this.error = (error as Error).message; }
  }
}
