import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-problem-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `<h2>Problema no encontrado</h2>
    <p>Esta dirección no corresponde a un problema de la colección.</p>
    <a routerLink="/problems">Ver la colección de problemas</a>`,
})
export class ProblemNotFoundComponent {}
