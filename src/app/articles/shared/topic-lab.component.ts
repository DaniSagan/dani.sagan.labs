import { sampleExperiment, SamplingExperiment } from './topic-sampling';
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LearningPlotComponent } from './learning-plot.component';
import { computeTopic, LabResult, TopicConfig, TOPIC_CONFIGS } from './topic-lab-model';

@Component({
 selector:'app-topic-lab',standalone:true,imports:[CommonModule,FormsModule,LearningPlotComponent],
 templateUrl:'./topic-lab.component.html',styleUrls:['./learning-article.css','./topic-lab.component.css']
})
export class TopicLabComponent implements OnChanges {
 @Input() topic='';
 config:TopicConfig={title:'',prompt:'',controls:[]};
 values:number[]=[];
 sample:SamplingExperiment|null=null;
 sampleCount=0;
 seed=20261011;
 get canSample():boolean{return ['bessel-correction','sampling-distributions','discrete-expectation'].includes(this.topic);}
 simulate():void{this.sampleCount=Math.min(5000,this.sampleCount+200);this.sample=sampleExperiment(this.topic,this.values[0],this.sampleCount,this.seed);}
 clearSample():void{this.sample=null;this.sampleCount=0;}
 result:LabResult={series:[],markers:[],bounds:[-5,5,-5,5],readouts:[]};
 generationCells=Array.from({length:289},(_,i)=>[i%17-4,Math.floor(i/17)-4]);
 get isGeometric():boolean{return ['apollonius-circles','quadratic-conics','triangle-metrics','de-moivre','harmonic-oscillator','reflection-principle'].includes(this.topic);}
 get bounds():[number,number,number,number] {
  const bounds=[...this.result.bounds] as [number,number,number,number];
  if(this.isGeometric){
   const [xmin,xmax,ymin,ymax]=bounds,mid=(xmin+xmax)/2,width=(ymax-ymin)*624/284;
   if(width>xmax-xmin){bounds[0]=mid-width/2;bounds[1]=mid+width/2;}
   else{const center=(ymin+ymax)/2,height=(xmax-xmin)*284/624;bounds[2]=center-height/2;bounds[3]=center+height/2;}
  }
  return bounds;
 }
 ngOnChanges():void {this.config=TOPIC_CONFIGS[this.topic];this.reset();}
 reset():void{this.values=this.config.controls.map(c=>c.value);this.update();}
 update():void{this.clearSample();this.values=this.values.map((v,i)=>Math.max(this.config.controls[i].min,Math.min(this.config.controls[i].max,Number(v))));this.result=computeTopic(this.topic,this.values);}
 advance():void {
  const i=this.topic==='harmonic-oscillator'?1:0,c=this.config.controls[i];
  this.values[i]=this.values[i]+c.step>c.max?c.min:Number((this.values[i]+c.step).toFixed(8));this.update();
 }
 isAlive(x:number,y:number):boolean{return !!this.result.cells?.some(([a,b])=>a===x&&b===y);}
}