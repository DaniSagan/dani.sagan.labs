import { Component } from '@angular/core';
import { FractalExplorerComponent, FractalRenderer, paint } from '../fractal-explorer/fractal-explorer.component';
@Component({ selector: 'app-levy-c-curve', standalone: true, imports: [FractalExplorerComponent], templateUrl: './levy-c-curve.component.html', styleUrl: './levy-c-curve.component.css' })
export class LevyCCurveComponent { static title='Curva C de Lévy'; static route='levy-c-curve'; readonly draw:FractalRenderer=(ctx,iterations)=>{paint(ctx,290);const rec=(a:number,b:number,c:number,d:number,n:number):void=>{if(!n){ctx.lineTo(c,d);return;}const x=(a+c)/2-(d-b)/2,y=(b+d)/2+(c-a)/2;rec(a,b,x,y,n-1);rec(x,y,c,d,n-1);};ctx.beginPath();ctx.moveTo(130,430);rec(130,430,550,250,iterations+2);ctx.stroke();}; }
