import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-planarity-bound', standalone: true, imports: [CommonModule, FormsModule],
  template: `
    <section class="bound" aria-label="Explorador de cotas de planaridad">
      <span class="eyebrow">UNA PRUEBA DE IMPOSIBILIDAD</span><h3>¿Caben tantas aristas en el plano?</h3>
      <p>Consideramos grafos simples, con al menos tres vértices. Estas cotas pueden descartar la planaridad; cumplirlas no la demuestra.</p>
      <div class="presets"><button type="button" (click)="preset(5,10,false)">K₅</button><button type="button" (click)="preset(6,9,true)">K₃,₃</button><button type="button" (click)="preset(8,12,true)">Grafo del cubo</button><button type="button" (click)="preset(4,6,false)">K₄</button></div>
      <div class="inputs"><label>Vértices · V = {{ vertices }}<input type="range" min="3" max="20" [(ngModel)]="vertices" (ngModelChange)="clamp()"></label><label>Aristas · A = {{ edges }}<input type="range" min="0" [max]="maxEdges" [(ngModel)]="edges"></label></div>
      <label class="check"><input type="checkbox" [(ngModel)]="bipartite" (ngModelChange)="clamp()">Se sabe además que el grafo es bipartito</label>
      <div class="comparison"><div><span>Aristas del grafo <b>{{ edges }}</b></span><div class="track"><i [style.width.%]="edges / maxEdges * 100" [class.exceeded]="edges > bound"></i></div></div><div><span>Cota planar {{ bipartite ? '2V − 4' : '3V − 6' }} <b>{{ bound }}</b></span><div class="track"><i class="limit" [style.width.%]="bound / maxEdges * 100"></i></div></div></div>
      <p class="verdict" [class.impossible]="edges > bound" role="status">{{ edges > bound ? 'No puede ser planar: supera la cota en ' + (edges - bound) + (edges - bound === 1 ? ' arista.' : ' aristas.') : 'La cota no descarta la planaridad. Hace falta estudiar las conexiones.' }}</p>
      <p class="note">La condición bipartita es una hipótesis adicional, no algo que pueda inferirse de V y A. Un dibujo con cruces tampoco demuestra por sí solo que el grafo sea no planar.</p>
    </section>`,
  styles: [`
    :host{display:block;margin:2rem 0}.bound{padding:1.5rem;background:#0f0f18;color:#e6e6ef;border:1px solid #354159;border-radius:16px;font-family:system-ui,sans-serif}.eyebrow{font-size:.65rem;letter-spacing:.15em;color:#9db5d0}h3{color:#e5eefc;font-size:1.3rem;margin:.6rem 0}p{color:#b7c6d9;font-size:.8rem;line-height:1.7}.presets{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}button{border:1px solid #455570;border-radius:7px;background:#1c283b;color:#deebff;padding:.55rem .8rem;cursor:pointer;font-size:.8rem}button:hover{border-color:#9ee8dc}.inputs{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin:1.3rem 0}label{font-size:.8rem;color:#c3d2e6}.inputs label{display:flex;flex-direction:column;gap:.7rem}input[type=range]{width:100%;accent-color:#91dcce}.check{display:flex;gap:.7rem;align-items:center}input[type=checkbox]{accent-color:#91dcce}button:focus-visible,input:focus-visible{outline:2px solid #a3e9ff;outline-offset:3px}.comparison{display:grid;gap:1rem;margin:1.5rem 0}.comparison span{display:flex;justify-content:space-between;font-size:.75rem;color:#b7c6d9}.comparison b{color:#eef5ff}.track{height:10px;background:#253047;border-radius:8px;margin-top:.5rem;overflow:hidden}.track i{display:block;height:100%;background:#9daefa;transition:width .25s}.track .limit{background:#83dac6}.track .exceeded{background:#ffb285}.verdict{border-left:3px solid #9daefa;padding:.7rem 1rem;background:#192036;color:#d8dffb}.verdict.impossible{border-color:#ffb285;color:#ffd3ae}.note{font-size:.7rem;color:#96abc5;margin-bottom:0}@media(max-width:550px){.inputs{grid-template-columns:1fr}.bound{padding:1.1rem}}@media(prefers-reduced-motion:reduce){.track i{transition:none}}
  `]
})
export class PlanarityBoundComponent {
  vertices = 5;
  edges = 10;
  bipartite = false;
  get bound(): number { return this.bipartite ? 2 * this.vertices - 4 : 3 * this.vertices - 6; }
  get maxEdges(): number { return this.bipartite ? Math.floor(this.vertices ** 2 / 4) : this.vertices * (this.vertices - 1) / 2; }
  clamp(): void { this.edges = Math.min(this.edges, this.maxEdges); }
  preset(vertices: number, edges: number, bipartite: boolean): void { this.vertices = vertices; this.edges = edges; this.bipartite = bipartite; }
}
