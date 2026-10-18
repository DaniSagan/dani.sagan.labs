import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
import { PlotSeries } from '../../shared/learning-plot.component';
import { TextLink } from '../../../shared/content/linked-text.component';

@Component({ selector: 'app-rsa-discrete-logarithm-article', standalone: true, imports: [...LEARNING_IMPORTS], templateUrl: './rsa-discrete-logarithm-article.component.html', styleUrls: ['../../shared/learning-article.css', './rsa-discrete-logarithm-article.component.css'] })
export class RsaDiscreteLogarithmArticleComponent {
  static readonly title = "RSA y logaritmo discreto: dos problemas inversos";
  static readonly route = 'rsa-discrete-logarithm';
  n = 1;
  t = 3;
  result = this.calculate();
  // concept-links:start
  readonly conceptLinks: readonly TextLink[] = [];
  // concept-links:end

  calculate(): { rows: [string, number | string][]; points: [number, number][]; note: string } {
    const n = this.n, t = this.t;
    const rows: [string, number | string][] = [];
    const points: [number, number][] = [];
    let note = '';
    const primes=[3,5,7,11,13,17],p=primes[n],q=primes[t];if(p===q){rows.push(['Condición','Elige dos primos distintos']);note='La construcción y la demostración de esta página suponen p distinto de q.';}else{const N=p*q,phi=(p-1)*(q-1);const gcd=(a:number,b:number):number=>b?gcd(b,a%b):a;let e=3;while(gcd(e,phi)!==1)e+=2;let d=1;while(e*d%phi!==1)d++;const pow=(a:number,k:number)=>{let out=1;for(let j=0;j<k;j++)out=out*a%N;return out;};const m=7%N,c=pow(m,e);rows.push(['p y q',p+', '+q],['N',N],['e y d',e+', '+d],['Mensaje',m],['Cifrado',c],['Recuperado',pow(c,d)]);note='Ejemplo didáctico determinista con representantes enteros pequeños; no implementa formatos de mensajes ni seguridad criptográfica.';}
    return { rows, points, note };
  }
  update(): void { this.result = this.calculate(); }
  reset(): void { this.n = 1; this.t = 3; this.update(); }
  format(value: number | string): string { return typeof value === 'number' ? value.toLocaleString('es', { maximumSignificantDigits: 8 }) : value; }
  get series(): PlotSeries[] { return [{ label: "Cifrar y recuperar un representante pequeño", points: this.result.points, kind: 'line' }]; }
  get bounds(): { xmin: number; xmax: number; ymin: number; ymax: number } {
    const xs = this.result.points.map(p => p[0]), ys = this.result.points.map(p => p[1]);
    const xmin = Math.min(0, ...xs), xmax = Math.max(1, ...xs), ymin = Math.min(0, ...ys), ymax = Math.max(1, ...ys);
    const dx = (xmax-xmin)*.08, dy = (ymax-ymin)*.08;
    
    return { xmin: xmin-dx, xmax: xmax+dx, ymin: ymin-dy, ymax: ymax+dy };
  }
}
