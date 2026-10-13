import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FractalExplorerComponent, FractalRenderer } from '../fractal-explorer/fractal-explorer.component';
type Point3 = [number, number, number];
@Component({ host: { class: 'fractal-page' }, selector: 'app-menger-sponge', standalone: true,
  imports: [RouterLink, FormsModule, FractalExplorerComponent],
  templateUrl: './menger-sponge.component.html', styleUrl: './menger-sponge.component.css' })
export class MengerSpongeComponent {
  static title = 'Esponja de Menger'; static route = 'menger-sponge';
  angle = 45;
  /** Exact finite construction: keep cells with at most one central coordinate. */
  cubes(level: number): Point3[] {
    let cells: Point3[] = [[0, 0, 0]];
    for (let n = 0; n < level; n++) {
      const next: Point3[] = [];
      for (const [x,y,z] of cells) for (let i=0;i<3;i++) for (let j=0;j<3;j++) for (let k=0;k<3;k++) {
        if (Number(i===1)+Number(j===1)+Number(k===1) <= 1) next.push([3*x+i,3*y+j,3*z+k]);
      }
      cells = next;
    }
    return cells;
  }
  readonly draw: FractalRenderer = (ctx, iterations, size) => {
    const level = Math.min(3, iterations), n = 3 ** level, cells = this.cubes(level);
    const key = (x: number,y: number,z: number) => `${x},${y},${z}`;
    const occupied = new Set(cells.map(p=>key(...p)));
    const a = this.angle * Math.PI / 180, c = Math.cos(a), s = Math.sin(a);
    const scale = size * .84 / Math.max(c+s, .45*(c+s)+.85);
    const project = ([x,y,z]: Point3): [number,number] => [size/2+scale*((x/n-.5)*c-(y/n-.5)*s),size/2+scale*(.45*((x/n-.5)*s+(y/n-.5)*c)-.85*(z/n-.5))];
    const faces: {points: Point3[]; color: string; depth: number}[] = [];
    for (const [x,y,z] of cells) {
      const add = (points: Point3[], color: string) => {
        const mid = points.reduce((sum,p)=>sum+p[0]*s+p[1]*c+p[2]*.45,0)/4;
        faces.push({points,color,depth:mid});
      };
      if (!occupied.has(key(x+1,y,z))) add([[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]],'#e8643a');
      if (!occupied.has(key(x,y+1,z))) add([[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]],'#3d6ca7');
      if (!occupied.has(key(x,y,z+1))) add([[x,y,z+1],[x+1,y,z+1],[x+1,y+1,z+1],[x,y+1,z+1]],'#d4a843');
    }
    faces.sort((a,b)=>a.depth-b.depth);
    ctx.lineWidth = .35; ctx.strokeStyle = '#0a0a0f';
    for (const face of faces) {
      ctx.beginPath();face.points.forEach((p,i)=>{const [x,y]=project(p);if(i)ctx.lineTo(x,y);else ctx.moveTo(x,y);});
      ctx.closePath();ctx.fillStyle=face.color;ctx.fill();ctx.stroke();
    }
  };
}
