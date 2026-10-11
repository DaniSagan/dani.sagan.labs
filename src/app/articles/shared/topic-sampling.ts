import { PlotSeries } from './learning-plot.component';
export interface SamplingExperiment { values:number[]; mean:number; variance:number; series:PlotSeries[]; bounds:[number,number,number,number]; }
export function sampleExperiment(topic:string,parameter:number,count:number,seed:number):SamplingExperiment {
 let state=seed>>>0;
 const random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return(state+.5)/4294967296;};
 const normal=()=>Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());
 const values:number[]=[];
 for(let sample=0;sample<count;sample++){
  if(topic==='discrete-expectation'){const face=Math.floor(random()*6)+1;values.push((face===6?10:face===5?5:0)-parameter);}
  else{
   const n=Math.round(parameter),sigma=topic==='bessel-correction'?3:6;
   const data=Array.from({length:n},()=>sigma*normal()),mean=data.reduce((s,x)=>s+x,0)/n;
   values.push(topic==='bessel-correction'?data.reduce((s,x)=>s+(x-mean)**2,0)/(n-1):mean);
  }
 }
 const mean=values.reduce((s,x)=>s+x,0)/count,variance=values.reduce((s,x)=>s+(x-mean)**2,0)/count;
 const lo=Math.min(...values),hi=Math.max(...values),width=Math.max(1e-6,hi-lo),bins=20,counts=Array(bins).fill(0) as number[];
 for(const x of values)counts[Math.min(bins-1,Math.floor((x-lo)/width*bins))]++;
 const points:[number,number][]=counts.map((n,i)=>[lo+(i+.5)*width/bins,n/count]);
 return{values,mean,variance,series:[{label:'Frecuencias relativas de muestras simuladas',kind:'bars',points}],bounds:[lo-width/bins,hi+width/bins,0,Math.max(...counts)/count*1.15]};
}
