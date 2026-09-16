import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { jordanPath, JordanPoint } from '../../shared/math/jordan-curve';

@Component({
  selector:'app-jordan-hypotheses',standalone:true,imports:[CommonModule,FormsModule],
  template:`
    <section class="hypotheses" aria-label="Explorador de las hipótesis de Jordan">
      <span class="eyebrow">LAS HIPÓTESIS IMPORTAN</span><h3>¿Qué cambia al abrir o cruzar la curva?</h3>
      <div class="buttons"><button type="button" (click)="select('simple')" [attr.aria-pressed]="mode === 'simple'">Simple y cerrada</button><button type="button" (click)="select('open')" [attr.aria-pressed]="mode === 'open'">Abrir una puerta</button><button type="button" (click)="select('eight')" [attr.aria-pressed]="mode === 'eight'">Figura de ocho</button><button type="button" (click)="select('two')" [attr.aria-pressed]="mode === 'two'">Dos curvas</button></div>
      <svg viewBox="0 0 740 380" role="img" [attr.aria-label]="description">
        <defs><radialGradient id="jordan-hypothesis-bg"><stop stop-color="#233957"/><stop offset="1" stop-color="#0c1426"/></radialGradient></defs>
        <rect width="740" height="380" fill="url(#jordan-hypothesis-bg)"/>
        <text x="28" y="34" class="caption">{{ components }} {{ components === 1 ? 'COMPONENTE DEL COMPLEMENTO' : 'COMPONENTES DEL COMPLEMENTO' }}</text>
        <ng-container *ngIf="mode === 'simple' || mode === 'two' || (mode === 'open' && gap === 0)"><ellipse cx="370" cy="195" rx="218" ry="135" fill="#74d6bb" fill-opacity=".23" class="curve"/><text x="200" y="202" class="label">I</text></ng-container>
        <ng-container *ngIf="mode === 'open' && gap > 0"><path [attr.d]="arc" fill="none" class="curve"/><circle *ngFor="let end of ends" [attr.cx]="end.x" [attr.cy]="end.y" r="5" fill="#ffc48e"/><path d="M390 195H635M623 188L635 195L623 202" fill="none" stroke="#ffce96" stroke-width="2" stroke-dasharray="5 5"/><text x="440" y="220" class="passage">Paso al exterior</text></ng-container>
        <ng-container *ngIf="mode === 'eight'"><path [attr.d]="leftLobe" fill="#a9a0f0" fill-opacity=".3" class="curve"/><path [attr.d]="rightLobe" fill="#75d8b9" fill-opacity=".28" class="curve"/><circle cx="370" cy="195" r="10" fill="none" stroke="#ffc58c" stroke-dasharray="3 3"/><text x="230" y="202" class="label">I₁</text><text x="500" y="202" class="label">I₂</text></ng-container>
        <ng-container *ngIf="mode === 'two'"><ellipse cx="370" cy="195" rx="102" ry="66" fill="#514c83" class="curve"/><text x="350" y="202" class="label">I₂</text></ng-container>
        <text x="650" y="335" class="label">E</text>
      </svg>
      <label *ngIf="mode === 'open'" class="gap">Apertura · {{ gap }}°<input aria-label="Ángulo de apertura del arco" type="range" min="0" max="100" [(ngModel)]="gap" (ngModelChange)="updateArc()"></label>
      <div class="result" role="status"><b>{{ verdict }}</b><p>{{ description }}</p></div>
      <p class="note">El número de componentes corresponde a estos ejemplos concretos, no a una regla general para cualquier curva con cruces. El grosor del trazo es visual: la curva matemática no tiene grosor.</p>
    </section>`,
  styles:[`
    :host{display:block;margin:2rem 0}.hypotheses{padding:1.5rem;background:#0f0f18;color:#e6e6ef;border:1px solid #354159;border-radius:16px;overflow:hidden;font-family:system-ui,sans-serif}.eyebrow{font-size:.65rem;color:#a2bad5;letter-spacing:.16em}h3{font-size:1.3rem;color:#edf3ff;margin:.6rem 0 1rem}.buttons{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}button{background:#1d2a3e;color:#e2efff;border:1px solid #435572;border-radius:7px;padding:.55rem .8rem;font-size:.78rem;cursor:pointer}button[aria-pressed=true],button:hover{background:#294454;border-color:#96e7d3}button:focus-visible,input:focus-visible{outline:2px solid #a8e9ff;outline-offset:3px}svg{display:block;width:100%;height:auto;border:1px solid #26374e;border-radius:10px}.curve{stroke:#9ae8d1;stroke-width:2.5;stroke-linejoin:round;filter:drop-shadow(0 0 5px #8adcc755)}.caption{fill:#a8c0dd;font-size:11px;letter-spacing:2px}.label{fill:#d4e5f8;font-size:17px}.passage{fill:#ffd3a0;font-size:13px}.gap{display:flex;flex-direction:column;gap:.7rem;margin:1.3rem 0;color:#c0d1e8;font-size:.8rem}input{accent-color:#93dfca;width:100%}.result{margin:1.2rem 0;padding:1rem;border-left:3px solid #a0dacd;background:#152233}.result b{color:#a8eed6}.result p{font-size:.83rem;line-height:1.7;color:#c0d1e7;margin:.5rem 0 0}.note{font-size:.7rem;color:#9aafc9;line-height:1.7;margin-bottom:0}@media(max-width:580px){.hypotheses{padding:1.1rem}h3{font-size:1.15rem}}
  `]
})
export class JordanHypothesesComponent {
  mode = 'simple'; gap = 35; arc = ''; ends: JordanPoint[] = [];
  readonly rightLobe = this.lobe(0);
  readonly leftLobe = this.lobe(Math.PI);
  constructor() { this.updateArc(); }
  get components(): number { return this.mode === 'open' && this.gap > 0 ? 1 : this.mode === 'eight' || this.mode === 'two' ? 3 : 2; }
  get verdict(): string { return this.mode === 'simple' || (this.mode === 'open' && this.gap === 0) ? 'Sí: una curva de Jordan.' : this.mode === 'open' ? 'Falta la condición de cerrada.' : this.mode === 'eight' ? 'Falta la condición de simple.' : 'La unión no es una sola curva de Jordan.'; }
  get description(): string {
    if (this.mode === 'simple' || (this.mode === 'open' && this.gap === 0)) return 'La curva divide el plano en un interior acotado y un exterior no acotado. Ambos tienen la curva entera como frontera.';
    if (this.mode === 'open') return 'Por pequeña que sea la apertura positiva, este arco deja un paso entre ambos lados. Su complemento es conexo: ya no hay una región interior separada.';
    if (this.mode === 'eight') return 'El cruce central rompe la simplicidad. Este ocho tiene dos regiones acotadas y una exterior: tres componentes en total.';
    return 'Cada curva por separado cumple Jordan. Juntas delimitan un disco interior, una región anular y el exterior: tres componentes.';
  }
  select(mode: string): void { this.mode=mode; if (mode==='open') this.gap=35; this.updateArc(); }
  updateArc(): void {
    const half=this.gap*Math.PI/360;
    const points=Array.from({length:161},(_,i)=>{const a=half+(2*Math.PI-2*half)*i/160;return {x:370+218*Math.cos(a),y:195+135*Math.sin(a)};});
    this.arc=jordanPath(points,false);this.ends=[points[0],points[points.length-1]];
  }
  private lobe(start: number): string {
    return jordanPath(Array.from({length:81},(_,i)=>{const a=start+Math.PI*i/80;return {x:370+215*Math.sin(a),y:195+125*Math.sin(2*a)};}));
  }
}
