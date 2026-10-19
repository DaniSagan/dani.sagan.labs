import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
type Q = [number, number, number, number];
@Component({ selector: 'app-quaternions-rotations', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './quaternions-rotations.component.html', styleUrls: ['../../shared/learning-article.css', './quaternions-rotations.component.css'] })
export class QuaternionsRotationsComponent {
  static readonly title = 'Cuaterniones y rotaciones: del producto de Hamilton al espacio';
  static readonly route = 'quaternions-rotations';
  axis = 'z'; angle = 90;
  readonly vector: Q = [0, 1, 1, 0];
  readonly math = {
    rules: String.raw`i^2=j^2=k^2=ijk=-1,\quad ij=k,\ jk=i,\ ki=j,\quad ji=-k,\ kj=-i,\ ik=-j`,
    norm: String.raw`\overline q=a-bi-cj-dk,\quad q\overline q=\overline q q=a^2+b^2+c^2+d^2,\quad q^{-1}=\frac{\overline q}{\|q\|^2}\ (q\ne0)`,
    rotation: String.raw`q=\cos\frac\theta2+(u_xi+u_yj+u_zk)\sin\frac\theta2,\qquad (0,v')=q(0,v)\overline q`,
    rodrigues: String.raw`v'=v\cos\theta+(u\times v)\sin\theta+u(u\cdot v)(1-\cos\theta)`,
  };
  multiply(p: Q, q: Q): Q {
    const [a,b,c,d]=p,[e,f,g,h]=q;
    return [a*e-b*f-c*g-d*h,a*f+b*e+c*h-d*g,a*g-b*h+c*e+d*f,a*h+b*g-c*f+d*e];
  }
  quaternion(axis: string, degrees: number): Q {
    const h=degrees*Math.PI/360,s=Math.sin(h);
    return [Math.cos(h),axis==='x'?s:0,axis==='y'?s:0,axis==='z'?s:0];
  }
  rotate(v: Q, axis: string, degrees: number): Q {
    const q=this.quaternion(axis,degrees),conjugate:Q=[q[0],-q[1],-q[2],-q[3]];
    return this.multiply(this.multiply(q,v),conjugate);
  }
  get rotated(): Q { return this.rotate(this.vector,this.axis,this.angle); }
  get reversed(): Q { return this.rotate(this.rotate(this.vector,'y',90),'x',90); }
  get composed(): Q { return this.rotate(this.rotate(this.vector,'x',90),'y',90); }
  norm(q: Q): number { return Math.hypot(...q); }
  sx(q: Q): number { return 200+80*(q[1]-.5*q[3]); }
  sy(q: Q): number { return 160-80*(q[2]-.5*q[3]); }
  format(q: Q): string { return '('+q.slice(1).map(x=>Math.abs(x)<1e-12?'0':x.toLocaleString('es',{maximumFractionDigits:5})).join('; ')+')'; }
}
