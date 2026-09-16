import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EULER_MASCHERONI, eulerApproximations, harmonicBounds, MAX_HARMONIC_N } from '../../shared/math/euler-mascheroni';

@Component({
  selector:'app-gamma-convergence',standalone:true,imports:[CommonModule,FormsModule],
  templateUrl:'./gamma-convergence.component.html',styleUrl:'./euler-mascheroni-widgets.css'
})
export class GammaConvergenceComponent {
  n=10;inputN:number|null=10;exponent=1;error='';
  readonly gamma=EULER_MASCHERONI;
  readonly methods=[{name:'Sin corrección',formula:'Hₙ − ln n',color:'#ffbf88'},{name:'Corregir 1/n',formula:'Anterior − 1/(2n)',color:'#90c7ff'},{name:'Corregir 1/n²',formula:'Anterior + 1/(12n²)',color:'#9be3c6'},{name:'Corregir 1/n⁴',formula:'Anterior − 1/(120n⁴)',color:'#c5a6ff'}];
  readonly ticks=[0,3,6,9,12,15];
  readonly tickLabels=['1','10⁻³','10⁻⁶','10⁻⁹','10⁻¹²','10⁻¹⁵'];
  readonly ns=[1,10,100,1000,10000,100000];
  paths:string[]=[];values:number[]=[];errors:number[]=[];lower=0;upper=0;width=0;
  constructor(){this.makeChart();this.calculate();}
  x(n:number):number{return 65+Math.log10(n)*118;}
  y(error:number):number{return 48+Math.min(15,Math.max(0,-Math.log10(Math.max(1e-15,error))))*18;}
  private makeChart():void{
    const samples=[...new Set(Array.from({length:181},(_,i)=>Math.round(10**(i*5/180))))];
    this.paths=this.methods.map((_,j)=>samples.map((n,i)=>`${i?'L':'M'}${this.x(n)},${this.y(Math.abs(eulerApproximations(n)[j]-this.gamma))}`).join(''));
  }
  calculate():void{
    this.values=eulerApproximations(this.n);this.errors=this.values.map(v=>Math.abs(v-this.gamma));
    const bounds=harmonicBounds(this.n);this.lower=bounds.lower;this.upper=bounds.upper;this.width=bounds.width;
  }
  fromSlider():void{this.n=Math.round(10**this.exponent);this.inputN=this.n;this.error='';this.calculate();}
  fromInput():void{
    if(this.inputN===null||!Number.isInteger(this.inputN)||this.inputN<1||this.inputN>MAX_HARMONIC_N){this.error='Introduce un entero entre 1 y 100000. Se conserva el último cálculo válido.';return;}
    this.n=this.inputN;this.exponent=Math.log10(this.n);this.error='';this.calculate();
  }
  preset(n:number):void{this.inputN=n;this.fromInput();}
  formatError(error:number):string{return error<1e-14?'≤ ~10⁻¹⁴ · límite numérico':error.toExponential(3);}
}
