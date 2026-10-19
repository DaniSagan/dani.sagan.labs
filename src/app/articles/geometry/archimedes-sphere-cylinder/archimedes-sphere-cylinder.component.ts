import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
@Component({selector:'app-archimedes-sphere-cylinder',standalone:true,imports:[...LEARNING_IMPORTS],templateUrl:'./archimedes-sphere-cylinder.component.html',styleUrls:['../../shared/learning-article.css','./archimedes-sphere-cylinder.component.css']})
export class ArchimedesSphereCylinderComponent {
 static readonly title='La esfera y el cilindro de Arquímedes: áreas y volúmenes';
 static readonly route='archimedes-sphere-cylinder';
 radius=1; level=0;
 get sphereSection():number{return Math.PI*this.radius**2*(1-this.level**2);}
 get coneSection():number{return Math.PI*this.radius**2*this.level**2;}
 get cylinderSection():number{return Math.PI*this.radius**2;}
 get sphereVolume():number{return 4*Math.PI*this.radius**3/3;}
 get cylinderVolume():number{return 2*Math.PI*this.radius**3;}
 get halfWidth():number{return 110*Math.sqrt(Math.max(0,1-this.level**2));}
 get y():number{return 150-110*this.level;}
 format(n:number):string{return n.toLocaleString('es',{maximumFractionDigits:4});}
 readonly math={
 sections:String.raw`A_E(z)=\pi(R^2-z^2),\quad A_C(z)=\pi R^2,\quad A_D(z)=\pi z^2,\qquad A_E(z)+A_D(z)=A_C(z)`,
 volume:String.raw`V_E=\int_{-R}^R\pi(R^2-z^2)\,dz=\frac43\pi R^3,\qquad V_C=2\pi R^3,\qquad \frac{V_E}{V_C}=\frac23`,
 area:String.raw`S_E=4\pi R^2,\qquad S_{C,\mathrm{cerrado}}=2\pi R(2R)+2\pi R^2=6\pi R^2`
 };
}
