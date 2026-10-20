import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { add, canonical, compare, compareLaurent, cutText, finiteCut, fromSigns, generations, negate, numeric, operation, parse, parseList, rational, Rational, stalkValue, SurrealNode, text, winningPlayer } from './surreal-engine';
@Component({selector:'app-surreal-lab',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./surreal-lab.component.html',styleUrls:['./surreal-lab.component.css']})
export class SurrealLabComponent {
 @Input() kind='tree';
 readonly allNodes=generations(5);day=3;selected='+-';view='tree';
 readonly fmt=text;
 get nodes():SurrealNode[]{return this.allNodes.filter(n=>n.day<=this.day);}
 get ordered():SurrealNode[]{return [...this.nodes].sort((a,b)=>compare(a.value,b.value));}
 get selectedValue():string{return text(fromSigns(this.selected));}
 get selectedCut():string{const c=canonical(fromSigns(this.selected));return cutText(c.left,c.right);}
 x(n:SurrealNode):number{if(!n.day)return 600;const i=parseInt(n.signs.replace(/-/g,'0').replace(/\+/g,'1'),2);return (i+.5)*1200/2**n.day;}
 parent(n:SurrealNode):SurrealNode{return this.allNodes.find(p=>p.signs===n.signs.slice(0,-1))!;}
 lineX(n:SurrealNode):number{return 60+(numeric(n.value)+this.day)*1080/(2*Math.max(1,this.day));}
 setDay(value:number):void{this.day=Number(value);if(this.selected.length>this.day)this.selected='';}
 cutLeft='0';cutRight='2';cutResult='1';cutError='';
 evaluateCut():void{try{this.cutResult=text(finiteCut(parseList(this.cutLeft),parseList(this.cutRight)));this.cutError='';}catch(e){this.cutError=(e as Error).message;this.cutResult='';}}
 presetCut(left:string,right:string):void{this.cutLeft=left;this.cutRight=right;this.evaluateCut();}
 readonly operands=['-2','-1','-1/2','0','1/4','1/2','1','3/2','2'];a='1/2';b='1/2';op:'+'|'*'='+';
 get calculation(){return operation(parse(this.a),parse(this.b),this.op);}
 get operationCut():string{const c=this.calculation;return cutText(c.left,c.right);}
 get operationResult():string{return text(this.calculation.result);}
 get negation():string{const c=canonical(parse(this.a));return cutText(c.right.map(negate),c.left.map(negate));}
 signs='+-+';
 appendSign(sign:string):void{if(this.signs.length<12)this.signs+=sign;}
 get signValue():string{return text(fromSigns(this.signs));}
 get signSteps(){return Array.from({length:this.signs.length+1},(_,i)=>({prefix:this.signs.slice(0,i),value:text(fromSigns(this.signs.slice(0,i)))}));}
 precision=4;realTarget='third';
 get realBounds(){const d=1n<<BigInt(this.precision);let n:bigint;
  if(this.realTarget==='third')n=d/3n;else{let lo=0n,hi=2n*d;while(hi-lo>1n){const mid=(lo+hi)/2n;if(mid*mid<2n*d*d)lo=mid;else hi=mid;}n=lo;}
  return {left:text(rational(n,d)),right:text(rational(n+1n,d)),width:'1/'+d,decimal:Number(n)/Number(d),upper:Number(n+1n)/Number(d)};
 }
 get realPosition():number{const b=this.realBounds;const target=this.realTarget==='third'?1/3:Math.SQRT2;return 60+880*(target-b.decimal)/(b.upper-b.decimal);}
 get binaryDigits():string{return this.realTarget==='third'?'01'.repeat(8).slice(0,this.precision):'0110101000001001'.slice(0,this.precision);}
 probe=8;scale='epsilon';
 get approximation():string{const n=BigInt(this.probe);return this.scale==='omega'?'N = '+n:this.scale==='epsilon'?'1/N = 1/'+n:this.scale==='epsilon2'?'1/N² = 1/'+(n*n):'N + 1 = '+(n+1n);}
 readonly scalePairs=[{a:'ω²',b:'100ω',aTerms:[[2,1n]],bTerms:[[1,100n]],why:'El término de mayor exponente domina cualquier coeficiente real finito.'},{a:'ω + 1',b:'ω',aTerms:[[1,1n],[0,1n]],bTerms:[[1,1n]],why:'Los términos ω se cancelan y queda 1, que es positivo.'},{a:'1/ω',b:'1/ω²',aTerms:[[-1,1n]],bTerms:[[-2,1n]],why:'Su diferencia tiene término principal ω⁻¹ con coeficiente positivo.'},{a:'ω − 10⁶',b:'10⁶',aTerms:[[1,1n],[0,-1000000n]],bTerms:[[0,1000000n]],why:'Tras restar, queda ω − 2·10⁶: el término principal es ω.'},{a:'10⁶/ω',b:'1',aTerms:[[-1,1000000n]],bTerms:[[0,1n]],why:'Un múltiplo real finito de 1/ω sigue siendo infinitesimal y es menor que 1.'},{a:'ω + 1',b:'1 + ω',aTerms:[[1,1n],[0,1n]],bTerms:[[1,1n],[0,1n]],why:'En el cuerpo surreal, la suma es conmutativa: todos los coeficientes de la diferencia son cero.'}];pair=0;
 get scaleComparison():string{const p=this.scalePairs[this.pair];const c=compareLaurent(new Map(p.aTerms as [number,bigint][]),new Map(p.bTerms as [number,bigint][]));return c>0?'>':c<0?'<':'=';}
 design='+-+';board='+-+';turn:'+'|'-'='+';started=false;gameMessage='Elige los colores y quién empieza.';history:{board:string;turn:'+'|'-';message:string}[]=[];
 appendEdge(sign:string):void{if(!this.started&&this.design.length<8){this.design+=sign;this.board=this.design;this.gameMessage='Diseño modificado. Pulsa Empezar.';}}
 loadStalk(signs:string):void{this.design=signs;this.board=signs;this.started=false;this.history=[];this.gameMessage='Diseño preparado. Pulsa Empezar.';}
 get edges(){return [...this.board].map((color,index)=>({color,index,y:30+(this.board.length-1-index)*54}));}
 get stalkLabel():string{return text(stalkValue(this.board));}
 get prediction():string{const winner=winningPlayer(this.board,this.turn);return (winner==='+'?'Azul':'Rojo')+' tiene una estrategia ganadora desde esta posición.';}
 startGame():void{this.board=this.design;this.history=[];this.started=true;this.checkGame();}
 checkGame():void{if(!this.board.includes(this.turn)){this.gameMessage=(this.turn==='+'?'Azul':'Rojo')+' no puede mover. Gana '+(this.turn==='+'?'Rojo':'Azul')+'.';this.started=false;}else this.gameMessage='Turno de '+(this.turn==='+'?'Azul (+)':'Rojo (−)')+'. Corta una arista de tu color.';}
 cutEdge(index:number):void{if(!this.started||this.board[index]!==this.turn)return;this.history.push({board:this.board,turn:this.turn,message:this.gameMessage});this.board=this.board.slice(0,index);this.turn=this.turn==='+'?'-':'+';this.checkGame();}
 undo():void{const state=this.history.pop();if(state){this.board=state.board;this.turn=state.turn;this.gameMessage=state.message;this.started=true;}}
 readonly questions=[{q:'¿Qué número representa {0 | 2}?',answers:['1: nació antes que los otros candidatos','El punto medio por definición','2: es la opción derecha'],correct:0,why:'El 1 es el surreal más simple estrictamente entre 0 y 2. Que aquí coincida con el punto medio es casual: {0 | 3} también vale 1.'},{q:'¿Por qué {0 | 0} no es un número surreal?',answers:['Porque contiene el cero','Porque exige ser mayor y menor que 0 a la vez','Porque todavía falta un día'],correct:1,why:'Las opciones numéricas deben satisfacer L < R. Como juego, {0 | 0} sí existe: es estrella, y gana quien empieza.'},{q:'En la aritmética de los surreales, 1 + ω…',answers:['Es igual a ω','Es igual a ω + 1','No está definido'],correct:1,why:'El cuerpo de los surreales tiene suma conmutativa. La suma ordinal es otra operación: allí 1 + ω = ω.'},{q:'¿Se obtiene 1/ω haciendo N muy grande en una pantalla?',answers:['Sí, en cuanto deja de verse','Sí, si N supera un millón','No: cualquier 1/N de ese experimento es un real positivo'],correct:2,why:'Un infinitesimal positivo es menor que 1/n para todo natural positivo n. Ninguna aproximación finita cumple todas esas desigualdades.'},{q:'¿Los surreales contienen i con i² = −1?',answers:['Sí, porque contienen todos los números','No: ningún cuerpo ordenado tiene una raíz cuadrada de −1','Solo a partir del día ω'],correct:1,why:'El cuadrado de un elemento de un cuerpo ordenado es no negativo. Los surreales son reales cerrados, no algebraicamente cerrados.'}];question=0;answer:number|null=null;
 chooseAnswer(i:number):void{this.answer=i;}
 nextQuestion():void{this.question=(this.question+1)%this.questions.length;this.answer=null;}
 reset():void{this.day=3;this.selected='+-';this.view='tree';this.presetCut('0','2');this.a=this.b='1/2';this.op='+';this.signs='+-+';this.precision=4;this.realTarget='third';this.probe=8;this.scale='epsilon';this.pair=0;this.loadStalk('+-+');this.turn='+';this.question=0;this.answer=null;}
}
