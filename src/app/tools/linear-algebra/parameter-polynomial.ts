import { Q } from './linear-math';
type P=Q[];
const trim=(p:P):P=>{while(p.length>1&&p[p.length-1].zero)p.pop();return p;};
const plus=(a:P,b:P):P=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]||new Q(0)).add(b[i]||new Q(0))));
const times=(a:P,b:P):P=>{if(a.length+b.length>34)throw Error('Grado simbólico máximo: 32.');const p=Array.from({length:a.length+b.length-1},()=>new Q(0));a.forEach((x,i)=>b.forEach((y,j)=>p[i+j]=p[i+j].add(x.mul(y))));return trim(p);};
const neg=(a:P):P=>a.map(q=>q.neg());
function polynomial(s:string):P{
  const compact=s.replace(/\s/g,''),tokens=compact.match(/\d+(?:\.\d+)?|t|[()+\-*/^]/g)||[];if(tokens.join('')!==compact)throw Error('Expresión no polinómica.');let i=0;
  const atom=():P=>{const v=tokens[i++];if(v==='('){const p=sum();if(tokens[i++]!==')')throw Error('Paréntesis');return p;}if(v==='t')return [new Q(0),new Q(1)];if(v&&/^\d/.test(v))return [Q.from(v)];throw Error('Expresión');};
  const power=():P=>{let p=atom();if(tokens[i]==='^'){i++;const e=unary();if(e.length!==1||e[0].d!==1n||e[0].n<0n||e[0].n>8n)throw Error('Exponente');let r:P=[new Q(1)];for(let k=0n;k<e[0].n;k++)r=times(r,p);p=r;}return p;};
  const unary=():P=>{if(tokens[i]==='+'){i++;return unary();}if(tokens[i]==='-'){i++;return neg(unary());}return power();};
  const product=():P=>{let p=unary();while(tokens[i]==='*'||tokens[i]==='/'){const op=tokens[i++],q=unary();if(op==='*')p=times(p,q);else{if(q.length!==1)throw Error('Coeficientes racionales en t: la discusión simbólica requiere polinomios.');p=p.map(v=>v.div(q[0]));}}return p;};
  const sum=():P=>{let p=product();while(tokens[i]==='+'||tokens[i]==='-'){const op=tokens[i++],q=product();p=plus(p,op==='+'?q:neg(q));}return p;};
  const p=sum();if(i!==tokens.length)throw Error('Expresión');return p;
}
function det(a:P[][]):P{if(a.length===1)return a[0][0];return a[0].reduce((p,v,j)=>plus(p,times(j%2?neg(v):v,det(a.slice(1).map(r=>r.filter((_,k)=>j!==k))))),[new Q(0)]);}
const value=(p:P,x:number):number=>p.reduceRight((s,q)=>s*x+q.value,0);
function roots(p:P):number[]{
  if(p.length<=1)return [];if(p.length===2)return [-p[0].value/p[1].value];
  const derivative=p.slice(1).map((q,i)=>q.mul(new Q(i+1))),crit=roots(derivative),bound=1+Math.max(...p.slice(0,-1).map(q=>Math.abs(q.div(p[p.length-1]).value)));
  const points=[-bound,...crit.filter(x=>x>-bound&&x<bound),bound],found:number[]=[];
  for(const x of crit)if(Math.abs(value(p,x))<1e-8*Math.max(1,...p.map(q=>Math.abs(q.value))))found.push(x);
  for(let i=0;i<points.length-1;i++){let a=points[i],b=points[i+1],fa=value(p,a),fb=value(p,b);if(fa*fb>=0)continue;for(let k=0;k<80;k++){const m=(a+b)/2,fm=value(p,m);if(fa*fm<=0){b=m;fb=fm;}else{a=m;fa=fm;}}found.push((a+b)/2);}
  return found.sort((a,b)=>a-b).filter((x,i,a)=>i===0||Math.abs(x-a[i-1])>1e-6);
}
export interface ParameterStudy {formula:string;roots:{approx:number;exact:string|null}[];note:string;}
export function studyParameter(text:string):ParameterStudy{
  try{
    const a=text.trim().split(/\n|;/).map(r=>r.trim().split(/[\s,]+/).slice(0,-1).map(polynomial));
    if(a.length!==a[0].length)return {formula:'',roots:[],note:'A es rectangular: analiza sus menores y los rangos; no existe un determinante único.'};
    const p=trim(det(a));const formula=p.map((q,i)=>q.zero?'':`${i&&q.n>0n?'+':''}${q}${i?i===1?'·t':`·t^${i}`:''}`).filter(Boolean).join(' ')||'0';
    const candidates=roots(p).map(approx=>{let exact:string|null=null;for(let d=1;d<=1000;d++){const n=Math.round(approx*d);if(Math.abs(n/d-approx)<1e-9){const q=new Q(n,d),v=p.reduceRight((s,c)=>s.mul(q).add(c),new Q(0));if(v.zero){exact=q.toString();break;}}}return {approx,exact};});
    return {formula,roots:candidates,note:p.every(q=>q.zero)?'Determinante idénticamente nulo: discute los menores y el rango ampliado para cada t.':'Fuera de las raíces del determinante, la solución es única. Las raíces irracionales se aproximan numéricamente: no se clasifican usando un decimal como si fuera la raíz exacta.'};
  }catch(e){return {formula:'',roots:[],note:(e as Error).message};}
}
