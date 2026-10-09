import { birthdayProbability } from '../../shared/math/birthday';
import { montyRound } from '../../shared/math/monty-hall';
export interface Trial {value:number;points:number[][];success?:boolean;}
export const EXPERIMENTS=['bertrand-angle','bertrand-radius','bertrand-area','pi','birthday','monty','coupons','matching','secretary','walk','arcsine-walk','ruin','benford','uniform-digits','dice','streak'];
export function benchmark(id:string,n:number,p:number):{value:number|null;label:string;formula:string}{
  switch(id){
    case 'bertrand-angle':return {value:1/3,label:'P(cuerda > √3)',formula:'P(D < 1/2) = 1/3 con extremos uniformes'};
    case 'bertrand-radius':return {value:1/2,label:'P(cuerda > √3)',formula:'P(D < 1/2) = 1/2 con distancia uniforme'};
    case 'bertrand-area':return {value:1/4,label:'P(cuerda > √3)',formula:'P(D < 1/2) = área del disco interior / área total = 1/4'};
    case 'pi':return {value:Math.PI,label:'Estimación de π',formula:'π = 4 P(X² + Y² ≤ 1), (X,Y) uniforme en [−1,1]²'};
    case 'birthday':return {value:birthdayProbability(n),label:'P(coincidencia)',formula:'1 − ∏(1 − k/365), k = 0,…,n−1; días independientes y equiprobables'};
    case 'monty':return {value:2/3,label:'P(ganar cambiando)',formula:'2/3; el presentador conoce el premio y siempre abre una cabra'};
    case 'coupons':return {value:n*Array.from({length:n},(_,i)=>1/(i+1)).reduce((s,v)=>s+v,0),label:'Extracciones esperadas',formula:'E(T) = n Hₙ, tipos equiprobables y extracciones con reemplazo'};
    case 'matching':{let sum=1,term=1;for(let i=1;i<=n;i++){term/=-i;sum+=term;}return {value:sum,label:'P(ninguna coincidencia)',formula:'P(desarreglo) = Σ (−1)ᵏ/k! → 1/e'};}
    case 'secretary':{const r=Math.max(1,Math.min(n-1,Math.floor(n*p)));return {value:r/n*Array.from({length:n-r},(_,i)=>1/(r+i)).reduce((s,v)=>s+v,0),label:'P(elegir el mejor)',formula:'P = (r/n) Σₖ₌ᵣⁿ⁻¹ 1/k; rechaza r candidatos y acepta el siguiente récord'};}
    case 'walk':return {value:n*(2*p-1),label:'Posición final esperada',formula:'E(Sₙ) = n(2p−1); pasos independientes ±1'};
    case 'arcsine-walk':return {value:p===0.5?0.5:null,label:'Fracción positiva esperada',formula:'Tiempo por encima de cero (mitad del tiempo en cero); límite de arcoseno para p = 1/2'};
    case 'ruin':{const start=Math.floor(n/2),ratio=(1-p)/p;return {value:Math.abs(p-0.5)<1e-10?start/n:(1-ratio**start)/(1-ratio**n),label:'P(alcanzar n antes que 0)',formula:'P = i/n si p=1/2; (1−((1−p)/p)ⁱ)/(1−((1−p)/p)ⁿ) en otro caso'};}
    case 'benford':return {value:Math.log10(2),label:'P(primer dígito = 1)',formula:'P(D=d) = log₁₀(1+1/d); mantisa logarítmica uniforme'};
    case 'uniform-digits':return {value:1/9,label:'P(primer dígito = 1)',formula:'Enteros uniformes entre 1 y 9: cada dígito tiene probabilidad 1/9'};
    case 'dice':return {value:n*3.5,label:'Suma esperada',formula:'E(ΣDᵢ) = 3,5n; dados independientes equilibrados'};
    default:return {value:null,label:'Mayor racha de éxitos',formula:'La mayor racha depende de n y p; simulación de ensayos independientes'};
  }
}
export function experiment(id:string,n:number,p:number,rng:()=>number):Trial{
  if(!EXPERIMENTS.includes(id)||!Number.isInteger(n)||n<2||n>500||!Number.isFinite(p)||p<0.05||p>0.95)throw Error('Experimento: n entero de 2 a 500 y p entre 0,05 y 0,95.');
  const points:number[][]=[];
  if(id.startsWith('bertrand')){const angle=2*Math.PI*rng(),d=id==='bertrand-radius'?rng():id==='bertrand-area'?Math.sqrt(rng()):Math.cos(Math.PI*rng()/2),half=Math.sqrt(1-d*d);return {value:+(d<0.5),success:d<0.5,points:[[-half*Math.sin(angle)+d*Math.cos(angle),half*Math.cos(angle)+d*Math.sin(angle)],[half*Math.sin(angle)+d*Math.cos(angle),-half*Math.cos(angle)+d*Math.sin(angle)]]};}
  if(id==='pi'){const x=2*rng()-1,y=2*rng()-1,hit=x*x+y*y<=1;return {value:hit?4:0,success:hit,points:[[x,y]]};}
  if(id==='birthday'){const days=Array.from({length:n},()=>Math.floor(rng()*365)),hit=new Set(days).size<n;return {value:+hit,success:hit,points:days.map((d,i)=>[i,d])};}
  if(id==='monty'){const round=montyRound(Math.floor(rng()*3),Math.floor(rng()*3),rng);return {value:+round.switchWins,success:round.switchWins,points:[[round.choice,round.prize]]};}
  if(id==='coupons'){const seen=new Set<number>();let draws=0;while(seen.size<n&&draws<100000){seen.add(Math.floor(rng()*n));draws++;if(draws<1500)points.push([draws,seen.size]);}if(seen.size<n)throw Error('Límite de extracciones alcanzado.');return {value:draws,points};}
  if(id==='matching'||id==='secretary'){const order=Array.from({length:n},(_,i)=>i);for(let i=n-1;i>0;i--){const j=Math.floor(rng()*(i+1));[order[i],order[j]]=[order[j],order[i]];}if(id==='matching'){const hit=order.every((v,i)=>v!==i);return {value:+hit,success:hit,points:order.map((v,i)=>[i,v])};}const r=Math.max(1,Math.min(n-1,Math.floor(n*p))),record=Math.max(...order.slice(0,r));const chosen=order.slice(r).find(v=>v>record)??order[n-1];return {value:+(chosen===n-1),success:chosen===n-1,points:order.map((v,i)=>[i,v])};}
  if(id==='benford'||id==='uniform-digits'){const digit=id==='benford'?Math.floor(10**rng()):1+Math.floor(9*rng());return {value:+(digit===1),success:digit===1,points:[[digit,0]]};}
  if(id==='dice'){let sum=0;for(let i=0;i<n;i++){sum+=1+Math.floor(6*rng());points.push([i+1,sum]);}return {value:sum,points};}
  if(id==='streak'){let streak=0,record=0;for(let i=0;i<n;i++){streak=rng()<p?streak+1:0;record=Math.max(record,streak);points.push([i+1,streak]);}return {value:record,points};}
  let x=id==='ruin'?Math.floor(n/2):0,positive=0;points.push([0,x]);
  const limit=id==='ruin'?50000:n;
  for(let i=1;i<=limit;i++){x+=rng()<p?1:-1;positive+=x>0?1:x===0?0.5:0;if(i<=1500)points.push([i,x]);if(id==='ruin'&&(x===0||x===n))return {value:+(x===n),success:x===n,points};}
  if(id==='ruin')throw Error('Trayectoria no absorbida tras 50000 pasos; reduce n.');
  return {value:id==='arcsine-walk'?positive/n:x,points};
}
