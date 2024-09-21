import{$ as P,A as B,B as q,C as Q,E as w,I,J as b,K as D,L as d,S as W,V as R,W as L,aa as S,ba as A,c as $,ca as E,d as p,e as V,f as M,fa as C,k as v,o as h,s as u,t as c,u as f,w as y}from"./chunk-BELQJ64D.js";var x=class e{constructor(t,o){this.x=t,this.y=o}get length(){return Math.sqrt(this.x*this.x+this.y*this.y)}get unit(){let t=this.length;return new e(this.x/t,this.y/t)}rotate(t){let o=Math.cos(t),r=Math.sin(t);return new e(o*this.x-r*this.y,r*this.x+o*this.y)}sum(t){return new e(this.x+t.x,this.y+t.y)}mult(t){return new e(this.x*t,this.y*t)}};function X(e,t){return new x(e.x+t.x,e.y+t.y)}function Y(e,t){return new x(e.x-t.x,e.y-t.y)}function Z(e,t){return new x(e.x*t,e.y*t)}var T=class{draw(t){}};var k=class extends T{constructor(){super(),this._items=[]}addItem(t){this._items.push(t)}addItems(t){for(let o of t)this.addItem(o)}clearItems(){this._items=[]}draw(t){this._items.forEach(o=>{o.draw(t)})}};var K=["myCanvas"],st=(()=>{let t=class t{constructor(){this.size=new x(100,100),this.scene=new k}ngAfterViewInit(){this.context=this.myCanvas.nativeElement.getContext("2d")}ngOnChanges(r){this.draw()}ngOnInit(){}refresh(){this.context.clearRect(0,0,this.myCanvas.nativeElement.width,this.myCanvas.nativeElement.height)}draw(){this.scene.draw(this.context)}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=p({type:t,selectors:[["app-canvas"]],viewQuery:function(n,i){if(n&1&&B(K,5),n&2){let m;q(m=Q())&&(i.myCanvas=m.first)}},inputs:{size:"size"},standalone:!0,features:[M,d],decls:2,vars:2,consts:[["myCanvas",""],[2,"border","1px solid black",3,"width","height"]],template:function(n,i){n&1&&f(0,"canvas",1,0),n&2&&h("width",i.size.x)("height",i.size.y)}});let e=t;return e})();var a=class{constructor(){}toLatex(){return""}};var g=class extends a{constructor(t,o){super(),this._lhs=t,this._rhs=o}toLatex(){return`${this._lhs.toLatex()} = ${this._rhs.toLatex()}`}};var N=class extends a{constructor(t,o){super(),this._base=t,this._exponent=o}toLatex(){return`{${this._base.toLatex()}}^{${this._exponent.toLatex()}}`}};var s=class extends a{constructor(t){super(),this._value=t}toLatex(){return`${this._value}`}};var j=class e extends a{constructor(t,o){super(),this._lhs=t,this._rhs=o}static multiProduct(t){return t.length==1?t[0]:new e(t[0],this.multiProduct(t.slice(1)))}toLatex(){return`${this._lhs.toLatex()} \\cdot ${this._rhs.toLatex()}`}};function _(e){let t=[],o=e;if(e<2)return[{base:e,exponent:1}];let r=2;for(;o>1;)if(o%r===0){let n=t.find(i=>i.base===r);n?n.exponent++:t.push({base:r,exponent:1}),o/=r}else r++;return t}function G(e){if(e<2)return!1;if(e===2)return!0;if(e%2===0)return!1;for(let t=3;t<Math.sqrt(e);t+=2)if(e%t===0)return!1;return!0}var z=(()=>{let t=class t{set formula(r){this._formula=r,r!==null?this.content=`$ ${r.toLatex()} $`:this.content=""}constructor(){this.content="",this._formula=null}ngOnInit(){}ngOnChanges(r){}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=p({type:t,selectors:[["app-formula"]],inputs:{formula:"formula"},standalone:!0,features:[M,d],decls:1,vars:1,consts:[[1,"formula",3,"mathjax"]],template:function(n,i){n&1&&f(0,"div",0),n&2&&h("mathjax",i.content)},dependencies:[L,R],styles:[".formula[_ngcontent-%COMP%]{margin:5px}"]});let e=t;return e})();var H=(()=>{let t=class t{constructor(){this.working=!1,this.value="",this.formula=null}ngOnInit(){}onButtonClick(r){let n=parseInt(this.value),i=_(n);this.formula=new g(new s(n),this.getFormulaFromFactors(i))}onInputTextChange(r){let n=parseInt(this.value);this.getFactorsAsync(n).then(i=>{this.formula=new g(new s(n),this.getFormulaFromFactors(i))})}getFormulaFromFactors(r){return j.multiProduct(r.map(n=>n.exponent>1?new N(new s(n.base),new s(n.exponent)):new s(n.base)))}getFactorsAsync(r){return new Promise((n,i)=>{n(_(r))})}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=p({type:t,selectors:[["app-prime-decomposition"]],standalone:!0,features:[d],decls:8,vars:2,consts:[[1,"widget-container"],[1,"widget-title"],["type","number","id","value","name","value",3,"ngModelChange","change","ngModel"],["type","button",3,"click"],[1,"formula-container"],[3,"formula"]],template:function(n,i){n&1&&(u(0,"div",0)(1,"div",1),w(2,"Factorizaci\xF3n"),c(),u(3,"input",2),D("ngModelChange",function(l){return b(i.value,l)||(i.value=l),l}),y("change",function(l){return i.onInputTextChange(l)}),c(),u(4,"button",3),y("click",function(){return i.onButtonClick(i.value)}),w(5,"Factorizar"),c(),u(6,"div",4),f(7,"app-formula",5),c()()),n&2&&(v(3),I("ngModel",i.value),v(4),h("formula",i.formula))},dependencies:[C,P,E,S,A,z],styles:[".container[_ngcontent-%COMP%]{padding:10px;border-top:1px solid #333;border-bottom:1px solid #333;border-left:5px solid #333;border-right:1px solid #333;background-color:#eee;min-height:65px}.formula-container[_ngcontent-%COMP%]{margin-top:15px}"]});let e=t;return e})();var F=class extends a{constructor(t,o){super(),this._name=t,this._parameters=o}toLatex(){return`${this._name}\\left(${this._parameters.map(t=>t.toLatex()).join(", ")}\\right)`}};var J=(()=>{let t=class t{constructor(){this.formula=null,this.value=""}ngOnInit(){}onInputTextChange(r){let n=parseInt(this.value),i=this.getArithmeticDerivative(n);this.formula=new g(new F("D",[new s(n)]),new s(i))}onButtonClick(r){let n=parseInt(r),i=this.getArithmeticDerivative(n);this.formula=new g(new F("D",[new s(n)]),new s(i))}getArithmeticDerivative(r){if(r<=1)return 0;if(G(r))return 1;{let n=_(r),i=0;for(let m of n)i+=r*m.exponent/m.base;return i}}};t.\u0275fac=function(n){return new(n||t)},t.\u0275cmp=p({type:t,selectors:[["app-arithmetic-derivative"]],standalone:!0,features:[d],decls:8,vars:2,consts:[[1,"widget-container"],[1,"widget-title"],["type","number","id","value","name","value",3,"ngModelChange","change","ngModel"],["type","button",3,"click"],[1,"formula-container"],[3,"formula"]],template:function(n,i){n&1&&(u(0,"div",0)(1,"div",1),w(2,"Derivada aritm\xE9tica"),c(),u(3,"input",2),D("ngModelChange",function(l){return b(i.value,l)||(i.value=l),l}),y("change",function(l){return i.onInputTextChange(l)}),c(),u(4,"button",3),y("click",function(){return i.onButtonClick(i.value)}),w(5,"Factorizar"),c(),u(6,"div",4),f(7,"app-formula",5),c()()),n&2&&(v(3),I("ngModel",i.value),v(4),h("formula",i.formula))},dependencies:[C,P,E,S,A,z],styles:[".formula-container[_ngcontent-%COMP%]{margin-top:15px}"]});let e=t;return e})();var Rt=(()=>{let t=class t{};t.\u0275fac=function(n){return new(n||t)},t.\u0275mod=V({type:t}),t.\u0275inj=$({imports:[W,L.forChild(),C,H,J]});let e=t;return e})();export{x as a,X as b,Y as c,Z as d,T as e,st as f,z as g,H as h,J as i,Rt as j};
