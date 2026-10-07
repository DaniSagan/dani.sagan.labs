/** Exact rational arithmetic. Expressions are parsed, never executed. */
export class Q {
  readonly n: bigint; readonly d: bigint;
  constructor(n: bigint | number, d: bigint | number = 1) {
    let a = BigInt(n), b = BigInt(d); if (!b) throw Error('División por cero.');
    if (b < 0n) { a = -a; b = -b; }
    let x = a < 0n ? -a : a, y = b; while (y) { const r = x % y; x = y; y = r; }
    this.n = a / x; this.d = b / x;
    if (this.n.toString().length > 600 || this.d.toString().length > 600) throw Error('El cálculo supera el límite de 600 cifras.');
  }
  static from(s: string): Q {
    if (!/^[+-]?\d+(?:\.\d+)?$/.test(s)) throw Error('Número inválido.');
    const digits = (s.split('.')[1] || '').length;
    return new Q(BigInt(s.replace('.', '')), 10n ** BigInt(digits));
  }
  add(q: Q): Q { return new Q(this.n*q.d+q.n*this.d,this.d*q.d); }
  neg(): Q { return new Q(-this.n,this.d); }
  sub(q: Q): Q { return this.add(q.neg()); }
  mul(q: Q): Q { return new Q(this.n*q.n,this.d*q.d); }
  div(q: Q): Q { return new Q(this.n*q.d,this.d*q.n); }
  get zero(): boolean { return this.n===0n; }
  get value(): number { return Number(this.n)/Number(this.d); }
  toString(): string { return this.d===1n ? `${this.n}` : `${this.n}/${this.d}`; }
}
export type Matrix = Q[][];
export const clone = (a: Matrix): Matrix => a.map(r=>r.slice());
export function expression(s: string, t: Q): Q {
  if (s.length>160) throw Error('Máximo 160 caracteres por coeficiente.');
  const compact=s.replace(/\s/g,''), tokens=compact.match(/\d+(?:\.\d+)?|t|[()+\-*/^]/g)||[];
  if(tokens.join('')!==compact) throw Error('Usa números, t, paréntesis y + − * / ^.');
  let i=0;
  const atom=():Q=>{ const v=tokens[i++]; if(v==='(') {const q=sum(); if(tokens[i++]!==')') throw Error('Falta cerrar un paréntesis.'); return q;} if(v==='t')return t; if(v && /^\d/.test(v))return Q.from(v); throw Error('Expresión incompleta.'); };
  const power=():Q=>{let q=atom(); if(tokens[i]==='^'){i++;const exponent=unary(); if(exponent.d!==1n||exponent.n<0n||exponent.n>8n)throw Error('Exponente entero entre 0 y 8.'); let r=new Q(1);for(let k=0n;k<exponent.n;k++)r=r.mul(q);q=r;}return q;};
  const unary=():Q=>{if(tokens[i]==='+'){i++;return unary();}if(tokens[i]==='-'){i++;return unary().neg();}return power();};
  const product=():Q=>{let q=unary();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],r=unary();q=op==='*'?q.mul(r):q.div(r);}return q;};
  const sum=():Q=>{let q=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],r=product();q=op==='+'?q.add(r):q.sub(r);}return q;};
  const result=sum();if(i!==tokens.length)throw Error('Expresión inválida.');return result;
}
export function parseMatrix(text: string,t: string): Matrix {
  if(text.length>7000||text.trim().split(/\n|;/).length>6)throw Error('Hasta 6 filas y 7000 caracteres.');
  const a=text.trim().split(/\n|;/).map(r=>r.trim().split(/[\s,]+/).map(s=>expression(s,expression(t,new Q(0)))));
  if(a.length<1||a.length>6||a[0].length<2||a[0].length>7||a.some(r=>r.length!==a[0].length))throw Error('Matriz rectangular: hasta 6 filas y 6 incógnitas, seguida de b.');
  return a;
}
export interface Reduction { matrix: Matrix; steps: {label:string;matrix:Matrix}[]; pivots:number[]; rank:number; augmentedRank:number; particular:Q[]; kernel:Q[][]; kind:string; }
export function reduce(input:Matrix):Reduction {
  const a=clone(input),m=a.length,n=a[0].length-1,pivots:number[]=[],steps:{label:string;matrix:Matrix}[]=[];
  const save=(label:string)=>steps.push({label,matrix:clone(a)});save('Matriz ampliada inicial');let row=0;
  for(let col=0;col<n&&row<m;col++){
    const p=a.findIndex((r,j)=>j>=row&&!r[col].zero);if(p<0)continue;
    if(p!==row){[a[p],a[row]]=[a[row],a[p]];save(`F${row+1} ↔ F${p+1}`);}
    const pivot=a[row][col];if(pivot.toString()!=='1'){a[row]=a[row].map(q=>q.div(pivot));save(`F${row+1} ← F${row+1} / (${pivot})`);}
    for(let j=0;j<m;j++)if(j!==row&&!a[j][col].zero){const factor=a[j][col];a[j]=a[j].map((q,k)=>q.sub(factor.mul(a[row][k])));save(`F${j+1} ← F${j+1} − (${factor}) F${row+1}`);}
    pivots.push(col);row++;
  }
  const bad=a.some(r=>r.slice(0,n).every(q=>q.zero)&&!r[n].zero),particular=Array.from({length:n},()=>new Q(0));
  pivots.forEach((p,i)=>particular[p]=a[i][n]);
  const kernel:Q[][]=[];for(let j=0;j<n;j++)if(!pivots.includes(j)){const v=Array.from({length:n},()=>new Q(0));v[j]=new Q(1);pivots.forEach((p,i)=>v[p]=a[i][j].neg());kernel.push(v);}
  return {matrix:a,steps,pivots,rank:row,augmentedRank:row+(bad?1:0),particular,kernel,kind:bad?'Incompatible':row===n?'Compatible determinado':'Compatible indeterminado'};
}
export function determinant(a:Matrix):Q {
  if(a.length!==a[0].length)throw Error('El determinante requiere una matriz cuadrada.');
  const b=clone(a);let d=new Q(1);
  for(let i=0;i<b.length;i++){const p=b.findIndex((r,j)=>j>=i&&!r[i].zero);if(p<0)return new Q(0);if(p!==i){[b[p],b[i]]=[b[i],b[p]];d=d.neg();}const v=b[i][i];d=d.mul(v);for(let j=i+1;j<b.length;j++){const f=b[j][i].div(v);for(let k=i;k<b.length;k++)b[j][k]=b[j][k].sub(f.mul(b[i][k]));}}
  return d;
}
export const transpose=(a:Matrix):Matrix=>a[0].map((_,j)=>a.map(r=>r[j]));
export function multiply(a:Matrix,b:Matrix):Matrix{return a.map(r=>b[0].map((_,j)=>r.reduce((s,q,k)=>s.add(q.mul(b[k][j])),new Q(0))));}
export function leastSquares(a:Matrix):Reduction {
  const coefficients=a.map(r=>r.slice(0,-1)),at=transpose(coefficients),normal=multiply(at,coefficients),rhs=multiply(at,a.map(r=>[r[r.length-1]]));
  return reduce(normal.map((r,i)=>[...r,rhs[i][0]]));
}
export function inverse(a:Matrix):Matrix|null {
  if(determinant(a).zero)return null;
  const columns=a.map((_,i)=>reduce(a.map((r,j)=>[...r,new Q(i===j?1:0)])).particular);return transpose(columns);
}
export interface Spectrum {real:boolean; values:number[]; vectors:number[][]; singular:number[]; condition:number;}
export function spectrum(a:number[][]):Spectrum {
  const [[p,q],[r,s]]=a,tr=p+s,det=p*s-q*r,disc=tr*tr-4*det;
  const values=disc>=0?[(tr+Math.sqrt(disc))/2,(tr-Math.sqrt(disc))/2]:[tr/2,Math.sqrt(-disc)/2];
  const vectors=disc>=0?values.map(l=>{let v=Math.abs(q)>Math.abs(r)?[q,l-p]:[l-s,r];if(Math.hypot(...v)<1e-12)v=Math.abs(p-l)<1e-12?[1,0]:[0,1];const n=Math.hypot(...v);return v.map(x=>x/n);}):[];
  const u=p*p+r*r,v=q*q+s*s,w=p*q+r*s,delta=Math.hypot(u-v,2*w),s1=Math.sqrt(Math.max(0,(u+v+delta)/2)),s2=s1?Math.abs(det)/s1:0;
  return {real:disc>=0,values,vectors,singular:[s1,s2],condition:s2?s1/s2:Infinity};
}
