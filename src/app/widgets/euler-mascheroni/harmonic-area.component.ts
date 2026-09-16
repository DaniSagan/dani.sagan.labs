import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EULER_MASCHERONI, harmonicBounds, harmonicGap, harmonicNumber } from '../../shared/math/euler-mascheroni';

@Component({
  selector:'app-harmonic-area',standalone:true,imports:[CommonModule,FormsModule],
  templateUrl:'./harmonic-area.component.html',styleUrl:'./euler-mascheroni-widgets.css'
})
export class HarmonicAreaComponent implements OnDestroy {
  n=8; selected=1; playing=false;
  readonly gamma=EULER_MASCHERONI;
  bars: {k:number;x:number;y:number;width:number;gap:string}[]=[];
  curve=''; h=0; logarithm=0; lower=0; upper=0;
  private timer?: ReturnType<typeof setInterval>;
  constructor(){this.rebuild();}
  x(value:number):number{return 60+(value-1)*620/this.n;}
  y(value:number):number{return 330-260*value;}
  get gapValue():number{return harmonicGap(this.selected);}
  rebuild():void{
    this.selected=Math.min(this.selected,this.n);
    this.h=harmonicNumber(this.n);this.logarithm=Math.log1p(this.n);
    const bounds=harmonicBounds(this.n);this.lower=bounds.lower;this.upper=bounds.upper;
    this.bars=Array.from({length:this.n},(_,i)=>{
      const k=i+1;
      const samples=Array.from({length:17},(_,j)=>{const x=k+1-j/16;return `${this.x(x)},${this.y(1/x)}`;});
      return {k,x:this.x(k),y:this.y(1/k),width:620/this.n,gap:`M${this.x(k)},${this.y(1/k)}L${this.x(k+1)},${this.y(1/k)}L${samples.join('L')}Z`};
    });
    // Logarithmic sampling keeps the steep section near x=1 smooth at large n.
    this.curve=Array.from({length:301},(_,i)=>{const x=Math.exp(Math.log1p(this.n)*i/300);return `${i?'L':'M'}${this.x(x)},${this.y(1/x)}`;}).join('');
  }
  manual():void{this.stop();this.rebuild();}
  setN(n:number):void{this.n=n;this.manual();}
  animate():void{
    if(this.playing){this.stop();return;}
    if(this.n===40)this.n=1;
    this.rebuild();this.playing=true;
    this.timer=setInterval(()=>{if(document.hidden)return;if(this.n<40){this.n++;this.rebuild();}else this.stop();},450);
  }
  stop():void{if(this.timer!==undefined)clearInterval(this.timer);this.timer=undefined;this.playing=false;}
  ngOnDestroy():void{this.stop();}
}
