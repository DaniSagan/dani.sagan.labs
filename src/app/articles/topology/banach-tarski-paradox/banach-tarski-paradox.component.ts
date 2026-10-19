import { Component } from '@angular/core';
import { LEARNING_IMPORTS } from '../../shared/learning-imports';
@Component({selector:'app-banach-tarski-paradox',standalone:true,imports:[...LEARNING_IMPORTS],templateUrl:'./banach-tarski-paradox.component.html',styleUrls:['../../shared/learning-article.css']})
export class BanachTarskiParadoxComponent {
 static readonly title='La paradoja de Banach-Tarski: qué se duplica y qué no';
 static readonly route='banach-tarski-paradox';
 word=''; readonly letters=['a','A','b','B'];
 inverse(c:string):string{return c===c.toLowerCase()?c.toUpperCase():c.toLowerCase();}
 reduce(word:string):string{const stack:string[]=[];for(const c of word){if(!this.letters.includes(c))throw new Error('Unknown generator');if(stack.length&&stack[stack.length-1]===this.inverse(c))stack.pop();else stack.push(c);}return stack.join('');}
 append(c:string):void{if(this.letters.includes(c)&&this.word.length<24)this.word+=c;}
 get reduced():string{return this.reduce(this.word);}
 ballSize(depth:number):number{return 2*3**depth-1;}
 readonly math={
 volume:String.raw`V(B)=\sum_{j=1}^m V(P_j)=\sum_{j=1}^m V(g_jP_j)=V(B\sqcup B)=2V(B)`,
 words:String.raw`aa^{-1}=a^{-1}a=bb^{-1}=b^{-1}b=e,\qquad ab\ne ba`,
 growth:String.raw`N_0=1,\quad N_n=4\cdot3^{n-1}\ (n\ge1),\quad 1+\sum_{k=1}^nN_k=2\cdot3^n-1`
 };
}
