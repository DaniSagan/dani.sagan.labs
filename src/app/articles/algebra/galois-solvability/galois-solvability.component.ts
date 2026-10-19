import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
@Component({ selector: 'app-galois-solvability', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './galois-solvability.component.html', styleUrls: ['../../shared/learning-article.css'] })
export class GaloisSolvabilityComponent {
  static readonly title = 'Teoría de Galois: simetrías de las raíces y resolución por radicales';
  static readonly route = 'galois-solvability';
  d = 2; a = 1; b = 1; swap = false;
  get imageB(): number { return this.swap ? -this.b : this.b; }
  get norm(): number { return this.a*this.a-this.d*this.b*this.b; }
  get value(): number { return this.a+this.b*Math.sqrt(this.d); }
  get image(): number { return this.a+this.imageB*Math.sqrt(this.d); }
  readonly math = {
    field: String.raw`\mathbb Q(\sqrt d)=\{a+b\sqrt d:a,b\in\mathbb Q\},\quad \sigma(a+b\sqrt d)=a-b\sqrt d`,
    invariant: String.raw`(a+b\sqrt d)(a-b\sqrt d)=a^2-db^2,\qquad \sigma^2=\mathrm{id}`,
    chain: String.raw`\{1\}\triangleleft A_3\triangleleft S_3,\qquad A_3\cong C_3,\quad S_3/A_3\cong C_2`,
  };
}
