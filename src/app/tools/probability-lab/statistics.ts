import { gaussian, makeLaw } from './distributions';
export interface Datum {x:number;y:number;group:number;}
export function mean(values:number[]):number {let m=0;values.forEach((x,i)=>m+=(x-m)/(i+1));return m;}
export function quantile(values:number[],p:number):number {
  if(!values.length)return NaN;const a=[...values].sort((x,y)=>x-y),i=(a.length-1)*p,k=Math.floor(i);return a[k]+(a[Math.min(k+1,a.length-1)]-a[k])*(i-k);
}
export function summarize(values:number[]){
  const m=mean(values),ss=values.reduce((sum,x)=>sum+(x-m)**2,0),median=quantile(values,0.5),q1=quantile(values,0.25),q3=quantile(values,0.75),iqr=q3-q1;
  return {n:values.length,mean:m,median,variance:values.length>1?ss/(values.length-1):0,sd:values.length>1?Math.sqrt(ss/(values.length-1)):0,q1,q3,min:values.length?Math.min(...values):NaN,max:values.length?Math.max(...values):NaN,mad:quantile(values.map(x=>Math.abs(x-median)),0.5),outliers:values.filter(x=>x<q1-1.5*iqr||x>q3+1.5*iqr).length};
}
function ranks(values:number[]):number[]{const order=values.map((x,i)=>({x,i})).sort((a,b)=>a.x-b.x),result:number[]=[];for(let i=0;i<order.length;){let j=i+1;while(j<order.length&&order[j].x===order[i].x)j++;for(let k=i;k<j;k++)result[order[k].i]=(i+j-1)/2+1;i=j;}return result;}
export function regression(data:Datum[]){
  const xs=data.map(p=>p.x),ys=data.map(p=>p.y),x=mean(xs),y=mean(ys),xx=xs.reduce((s,v)=>s+(v-x)**2,0),yy=ys.reduce((s,v)=>s+(v-y)**2,0),xy=data.reduce((s,p)=>s+(p.x-x)*(p.y-y),0),slope=xx?xy/xx:null,intercept=slope===null?null:y-slope*x;
  const r=xx&&yy?xy/Math.sqrt(xx*yy):null,rx=ranks(xs),ry=ranks(ys),mx=mean(rx),my=mean(ry),den=Math.sqrt(rx.reduce((s,v)=>s+(v-mx)**2,0)*ry.reduce((s,v)=>s+(v-my)**2,0));
  return {slope,intercept,r,r2:r===null?null:r*r,spearman:den?rx.reduce((s,v,i)=>s+(v-mx)*(ry[i]-my),0)/den:null,residuals:data.map(p=>slope===null||intercept===null?NaN:p.y-intercept-slope*p.x)};
}
export function histogram(values:number[],min:number,max:number,bins:number):number[]{const counts=Array(bins).fill(0) as number[];for(const v of values){if(v<min||v>max)continue;const i=Math.min(bins-1,Math.floor((v-min)/(max-min)*bins));if(i>=0)counts[i]++;}return counts;}
export function kde(values:number[],x:number,bandwidth:number):number {return values.length&&bandwidth>0?values.reduce((s,v)=>s+Math.exp(-0.5*((x-v)/bandwidth)**2),0)/(values.length*bandwidth*Math.sqrt(2*Math.PI)):0;}
const criticalCache=new Map<string,number>();
export function confidenceInterval(values:number[],confidence:number,sigma:number|null=null):[number,number]{
  const stats=summarize(values);if(values.length<2)throw Error('Un intervalo necesita al menos dos observaciones.');
  const key=`${sigma===null?values.length:'normal'}:${confidence}`;
  let critical=criticalCache.get(key);if(critical===undefined){critical=makeLaw(sigma===null?'student':'normal',sigma===null?{nu:values.length-1}:{}).quantile((1+confidence)/2);if(criticalCache.size>100)criticalCache.clear();criticalCache.set(key,critical);}
  const margin=critical*(sigma===null?stats.sd:sigma)/Math.sqrt(values.length);
  return [stats.mean-margin,stats.mean+margin];
}
export function bootstrap(values:number[],rng:()=>number,statistic:'mean'|'median'='mean'):number {const sample=Array.from({length:values.length},()=>values[Math.floor(rng()*values.length)]);return statistic==='mean'?mean(sample):quantile(sample,0.5);}
export function permutationDifference(a:number[],b:number[],rng:()=>number):number {
  const pool=[...a,...b];for(let i=pool.length-1;i>0;i--){const j=Math.floor(rng()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}return mean(pool.slice(0,a.length))-mean(pool.slice(a.length));
}
export const ANSCOMBE:Datum[][]=[
  [8.04,6.95,7.58,8.81,8.33,9.96,7.24,4.26,10.84,4.82,5.68],
  [9.14,8.14,8.74,8.77,9.26,8.1,6.13,3.1,9.13,7.26,4.74],
  [7.46,6.77,12.74,7.11,7.81,8.84,6.08,5.39,8.15,6.42,5.73],
  [6.58,5.76,7.71,8.84,8.47,7.04,5.25,12.5,5.56,7.91,6.89]
].map((ys,j)=>ys.map((y,i)=>({x:j===3?[8,8,8,8,8,8,8,19,8,8,8][i]:[10,8,13,9,11,14,6,4,12,7,5][i],y,group:0})));
export function syntheticData(id:string,rng:()=>number):Datum[]{
  if(id.startsWith('anscombe-'))return ANSCOMBE[+id.slice(-1)-1].map(p=>({...p}));
  if(id==='simpson')return Array.from({length:80},(_,i)=>{const g=i<40?0:1,x=(g?6:0)+4*rng();return {x,y:(g?2:9)+0.7*(x-(g?6:0))+gaussian(rng)*0.5,group:g};});
  return Array.from({length:120},(_,i)=>{
    const t=i/119*2*Math.PI,x=-4+8*rng(),z=gaussian(rng);
    switch(id){
      case 'circle':return {x:3*Math.cos(t),y:3*Math.sin(t),group:0};
      case 'spiral':return {x:t*Math.cos(t*3),y:t*Math.sin(t*3),group:0};
      case 'parabola':return {x,y:x*x+z,group:0};
      case 'sine':return {x,y:Math.sin(x*2)+z*0.15,group:0};
      case 'heteroscedastic':return {x,y:x+z*(0.2+Math.abs(x)),group:0};
      case 'outlier':return i===0?{x:20,y:-25,group:0}:{x,y:2*x+z,group:0};
      case 'clusters':return {x:x+(i%2?6:-6),y:0.5*x+z+(i%2?6:-6),group:i%2};
      case 'independent':return {x,y:gaussian(rng)*2,group:0};
      default:return {x,y:0.8*x+z,group:0};
    }
  });
}
export function parseData(text:string):Datum[]{
  if(text.length>100000)throw Error('Máximo 100000 caracteres.');
  const lines=text.trim().split(/\n/).filter(s=>s.trim()&&!s.trim().startsWith('#'));if(lines.length<2||lines.length>2000)throw Error('Introduce entre 2 y 2000 filas.');
  const data=lines.map((s,i)=>{const cells=s.trim().split(/[\s,;]+/);if(cells.length<1||cells.length>3||cells.some(v=>!Number.isFinite(Number(v))))throw Error(`Fila ${i+1}: usa y, o x y, o x y grupo, con punto decimal.`);return {x:cells.length===1?i+1:Number(cells[0]),y:Number(cells.length===1?cells[0]:cells[1]),group:cells.length===3?Number(cells[2]):0};});
  if(data.some(p=>Math.max(Math.abs(p.x),Math.abs(p.y))>1e12||!Number.isInteger(p.group)||p.group<0||p.group>9))throw Error('Valores de módulo ≤ 10¹² y grupos enteros de 0 a 9.');return data;
}
export function bivariateNormal(n:number,rho:number,rng:()=>number):Datum[]{return Array.from({length:n},()=>{const x=gaussian(rng);return {x,y:rho*x+Math.sqrt(1-rho*rho)*gaussian(rng),group:0};});}
