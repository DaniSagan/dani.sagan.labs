import{h as Ce,j as Ee}from"./chunk-Q3KAW73M.js";import{$ as Z,A as ue,B as pe,C as me,E as m,F as U,G as J,I as k,J as D,K as W,L as P,M as b,Q as he,R as fe,S as de,W as ge,X as ve,Y as xe,Z as Me,_ as X,a as H,aa as K,ba as $,c as z,ca as ee,d as C,da as we,e as Q,ea as _e,fa as L,g as v,h as x,k as d,n as R,o as E,s as p,t as u,u as V,v as se,w,x as T,z as j}from"./chunk-BELQJ64D.js";var Ve=["canvas"];function Oe(e,t){if(e&1){let o=se();p(0,"div")(1,"label",12),m(2),u(),p(3,"input",13),w("input",function(i){let r=v(o).index,s=T();return x(s.updateEquations(i,r))}),u(),p(4,"label",12),m(5,"Color:"),u(),p(6,"input",14),W("ngModelChange",function(i){let r=v(o).index,s=T();return D(s.colors[r],i)||(s.colors[r]=i),x(i)}),w("change",function(i){let r=v(o).index,s=T();return x(s.updateEquations(i,r))}),u(),p(7,"button",10),w("click",function(){let i=v(o).index,r=T();return x(r.removeEquation(i))}),m(8,"Eliminar"),u()()}if(e&2){let o=t.$implicit,n=t.index,i=T();d(),j("for","equation",n,""),d(),J("Ecuaci\xF3n ",n+1,":"),d(),j("id","equation",n,""),E("value",o),d(),j("for","color",n,""),d(2),j("id","color",n,""),k("ngModel",i.colors[n])}}var te=(()=>{let t=class t{constructor(){this.equations=["x^2"],this.colors=["#00FF00"],this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.scaleFactor=1,this.centerX=0,this.centerY=0}ngOnInit(){this.ctx=this.canvas.nativeElement.getContext("2d"),this.drawGraph()}drawGraph(){let n=this.canvas.nativeElement.width,i=this.canvas.nativeElement.height;this.ctx.clearRect(0,0,n,i),this.ctx.fillStyle="#000000",this.ctx.fillRect(0,0,n,i),this.drawAxes(),this.equations.forEach((r,s)=>{this.drawEquation(r,this.colors[s]||"#FFFFFF")})}drawAxes(){let n=this.canvas.nativeElement.width,i=this.canvas.nativeElement.height;this.ctx.strokeStyle="#FFFFFF",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(0,this.yToPixel(0)),this.ctx.lineTo(n,this.yToPixel(0)),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(this.xToPixel(0),0),this.ctx.lineTo(this.xToPixel(0),i),this.ctx.stroke()}drawEquation(n,i){let r=this.canvas.nativeElement.width;this.ctx.strokeStyle=i,this.ctx.lineWidth=2,this.ctx.beginPath();let s=null,a=null;for(let c=0;c<r;c++){let l=this.pixelToX(c),M=this.evaluateEquation(n,l);if(M!=null&&!isNaN(M)){let f=this.yToPixel(M);s!==null&&a!==null?this.ctx.lineTo(c,f):this.ctx.moveTo(c,f),s=c,a=f}}this.ctx.stroke()}pixelToX(n){let i=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return this.xMin+n*r/i}pixelToY(n){let i=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return this.yMin+n*r/i}yToPixel(n){let i=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return i-(n-this.yMin)*(i/r)}xToPixel(n){let i=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return(n-this.xMin)*(i/r)}evaluateEquation(n,i){try{let r=n.replace(/\^/g,"**").replace(new RegExp("(?<=\\W|^)sqrt(?=\\W)","g"),"Math.sqrt").replace(new RegExp("(?<=\\W|^)cos(?=\\W)","g"),"Math.cos").replace(new RegExp("(?<=\\W|^)sin(?=\\W)","g"),"Math.sin").replace(new RegExp("(?<=\\W|^)tan(?=\\W)","g"),"Math.tan").replace(new RegExp("(?<=\\W|^)ln(?=\\W)","g"),"Math.log").replace(new RegExp("(?<=\\W|^)abs(?=\\W)","g"),"Math.abs").replace(new RegExp("(?<=\\W|^)e(?=\\W|$)","g"),"(Math.E)").replace(new RegExp("(?<=\\W|^)pi(?=\\W|$)","g"),"(Math.PI)").replace(/x/g,`(${i})`);return Function(`"use strict"; return (${r})`)()}catch{return}}handleWheel(n){n.preventDefault();let i=1.1;n.deltaY<0?this.scaleFactor/=i:this.scaleFactor*=i,this.drawGraph()}updateLimits(){this.drawGraph()}updateEquations(n,i){let r=n.target;this.equations[i]=r.value,this.drawGraph()}addEquation(){this.equations.push(""),this.colors.push("#FFFFFF")}removeEquation(n){this.equations.splice(n,1),this.colors.splice(n,1),this.drawGraph()}resetGraph(){this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.scaleFactor=1,this.centerX=0,this.centerY=0,this.equations=["x^2"],this.colors=["#00FF00"],this.drawGraph()}trackByIndex(n,i){return n}};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=C({type:t,selectors:[["app-graph-plotter"]],viewQuery:function(i,r){if(i&1&&ue(Ve,7),i&2){let s;pe(s=me())&&(r.canvas=s.first)}},standalone:!0,features:[P],decls:22,vars:6,consts:[["canvas",""],["for","xMin"],["id","xMin","type","number",3,"ngModelChange","change","ngModel"],["for","xMax"],["id","xMax","type","number",3,"ngModelChange","change","ngModel"],["for","yMin"],["id","yMin","type","number",3,"ngModelChange","change","ngModel"],["for","yMax"],["id","yMax","type","number",3,"ngModelChange","change","ngModel"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"click"],["width","800","height","600",3,"wheel"],[3,"for"],["type","text",3,"input","id","value"],["type","color",3,"ngModelChange","change","id","ngModel"]],template:function(i,r){if(i&1){let s=se();p(0,"h2"),m(1,"Gr\xE1ficas de Funciones"),u(),p(2,"div")(3,"label",1),m(4,"X M\xEDn:"),u(),p(5,"input",2),W("ngModelChange",function(c){return v(s),D(r.xMin,c)||(r.xMin=c),x(c)}),w("change",function(){return v(s),x(r.updateLimits())}),u(),p(6,"label",3),m(7,"X M\xE1x:"),u(),p(8,"input",4),W("ngModelChange",function(c){return v(s),D(r.xMax,c)||(r.xMax=c),x(c)}),w("change",function(){return v(s),x(r.updateLimits())}),u(),p(9,"label",5),m(10,"Y M\xEDn:"),u(),p(11,"input",6),W("ngModelChange",function(c){return v(s),D(r.yMin,c)||(r.yMin=c),x(c)}),w("change",function(){return v(s),x(r.updateLimits())}),u(),p(12,"label",7),m(13,"Y M\xE1x:"),u(),p(14,"input",8),W("ngModelChange",function(c){return v(s),D(r.yMax,c)||(r.yMax=c),x(c)}),w("change",function(){return v(s),x(r.updateLimits())}),u()(),R(15,Oe,9,11,"div",9),p(16,"button",10),w("click",function(){return v(s),x(r.addEquation())}),m(17,"Agregar Ecuaci\xF3n"),u(),p(18,"button",10),w("click",function(){return v(s),x(r.resetGraph())}),m(19,"Reiniciar Gr\xE1fica"),u(),p(20,"canvas",11,0),w("wheel",function(c){return v(s),x(r.handleWheel(c))}),u()}i&2&&(d(5),k("ngModel",r.xMin),d(3),k("ngModel",r.xMax),d(3),k("ngModel",r.yMin),d(3),k("ngModel",r.yMax),d(),E("ngForOf",r.equations)("ngForTrackBy",r.trackByIndex))},dependencies:[L,Z,ee,K,$,he],styles:["canvas[_ngcontent-%COMP%]{border:1px solid #00FFFF;display:block;margin-top:20px}input[type=text][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], input[type=color][_ngcontent-%COMP%]{margin:5px;padding:5px}button[_ngcontent-%COMP%]{margin:5px;padding:5px;background-color:#444;color:#fff;border:none;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#666}"]});let e=t;return e})();var ie=(()=>{let t=class t{constructor(){}ngOnInit(){}};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=C({type:t,selectors:[["app-prime-decomposition-article"]],standalone:!0,features:[P],decls:3,vars:0,template:function(i,r){i&1&&(p(0,"h2"),m(1,"Factorizaci\xF3n en primos"),u(),V(2,"app-prime-decomposition"))},dependencies:[Ce]});let e=t;return e})();var Ae=()=>["/tools/prime-decomposition"],ce=()=>["active"],le=()=>({exact:!0}),qe=()=>["/tools/graph-plotter"],Ie=()=>["/tools/pi-decimals"],Pe=(()=>{let t=class t{};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=C({type:t,selectors:[["app-tools-navbar"]],standalone:!0,features:[P],decls:17,vars:18,consts:[[1,"nav-items"],[1,"subsection"],[3,"routerLink","routerLinkActive","routerLinkActiveOptions"]],template:function(i,r){i&1&&(p(0,"h2"),m(1,"Herramientas"),u(),p(2,"div",0)(3,"ul")(4,"li")(5,"div",1),m(6,"Otros"),u(),p(7,"ul")(8,"li")(9,"a",2),m(10,"Factorizaci\xF3n en primos"),u()(),p(11,"li")(12,"a",2),m(13,"Graficador de funciones"),u()(),p(14,"li")(15,"a",2),m(16,"Calculadora de decimales de pi"),u()()()()()()),i&2&&(d(9),E("routerLink",b(9,Ae))("routerLinkActive",b(10,ce))("routerLinkActiveOptions",b(11,le)),d(3),E("routerLink",b(12,qe))("routerLinkActive",b(13,ce))("routerLinkActiveOptions",b(14,le)),d(3),E("routerLink",b(15,Ie))("routerLinkActive",b(16,ce))("routerLinkActiveOptions",b(17,le)))},dependencies:[xe,Me],styles:[".nav-items[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style-type:none;margin:0 auto;padding:0}.nav-items[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{min-height:30px}.nav-items[_ngcontent-%COMP%]   .subsection[_ngcontent-%COMP%]{padding:5px 0;margin:5px 0;color:#000;font-weight:700}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:5px;margin:5px;text-decoration:none;min-width:100px;color:#000;font-weight:400}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#333;color:#fff}.nav-items[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background-color:#04aa6d;color:#fff}"]});let e=t;return e})();var be=(()=>{let t=class t{};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=C({type:t,selectors:[["app-tools-content"]],standalone:!0,features:[P],decls:5,vars:0,consts:[[1,"article-with-sidebar"],[1,"sidebar"],[1,"body-text"]],template:function(i,r){i&1&&(p(0,"div",0)(1,"div",1),V(2,"app-tools-navbar"),u(),p(3,"div",2),V(4,"router-outlet"),u()())},dependencies:[Pe,ve]});let e=t;return e})();var Ne=20,Le=1,O=1e6,ye=1e6,Ge=-7,Be=21,Re=!1,Y="[big.js] ",A=Y+"Invalid ",ne=A+"decimal places",je=A+"rounding mode",Fe=Y+"Division by zero",h={},y=void 0,Xe=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function Se(){function e(t){var o=this;if(!(o instanceof e))return t===y?Se():new e(t);if(t instanceof e)o.s=t.s,o.e=t.e,o.c=t.c.slice();else{if(typeof t!="string"){if(e.strict===!0&&typeof t!="bigint")throw TypeError(A+"value");t=t===0&&1/t<0?"-0":String(t)}Ye(o,t)}o.constructor=e}return e.prototype=h,e.DP=Ne,e.RM=Le,e.NE=Ge,e.PE=Be,e.strict=Re,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function Ye(e,t){var o,n,i;if(!Xe.test(t))throw Error(A+"number");for(e.s=t.charAt(0)=="-"?(t=t.slice(1),-1):1,(o=t.indexOf("."))>-1&&(t=t.replace(".","")),(n=t.search(/e/i))>0?(o<0&&(o=n),o+=+t.slice(n+1),t=t.substring(0,n)):o<0&&(o=t.length),i=t.length,n=0;n<i&&t.charAt(n)=="0";)++n;if(n==i)e.c=[e.e=0];else{for(;i>0&&t.charAt(--i)=="0";);for(e.e=o-n-1,e.c=[],o=0;n<=i;)e.c[o++]=+t.charAt(n++)}return e}function q(e,t,o,n){var i=e.c;if(o===y&&(o=e.constructor.RM),o!==0&&o!==1&&o!==2&&o!==3)throw Error(je);if(t<1)n=o===3&&(n||!!i[0])||t===0&&(o===1&&i[0]>=5||o===2&&(i[0]>5||i[0]===5&&(n||i[1]!==y))),i.length=1,n?(e.e=e.e-t+1,i[0]=1):i[0]=e.e=0;else if(t<i.length){if(n=o===1&&i[t]>=5||o===2&&(i[t]>5||i[t]===5&&(n||i[t+1]!==y||i[t-1]&1))||o===3&&(n||!!i[0]),i.length=t,n){for(;++i[--t]>9;)if(i[t]=0,t===0){++e.e,i.unshift(1);break}}for(t=i.length;!i[--t];)i.pop()}return e}function I(e,t,o){var n=e.e,i=e.c.join(""),r=i.length;if(t)i=i.charAt(0)+(r>1?"."+i.slice(1):"")+(n<0?"e":"e+")+n;else if(n<0){for(;++n;)i="0"+i;i="0."+i}else if(n>0)if(++n>r)for(n-=r;n--;)i+="0";else n<r&&(i=i.slice(0,n)+"."+i.slice(n));else r>1&&(i=i.charAt(0)+"."+i.slice(1));return e.s<0&&o?"-"+i:i}h.abs=function(){var e=new this.constructor(this);return e.s=1,e};h.cmp=function(e){var t,o=this,n=o.c,i=(e=new o.constructor(e)).c,r=o.s,s=e.s,a=o.e,c=e.e;if(!n[0]||!i[0])return n[0]?r:i[0]?-s:0;if(r!=s)return r;if(t=r<0,a!=c)return a>c^t?1:-1;for(s=(a=n.length)<(c=i.length)?a:c,r=-1;++r<s;)if(n[r]!=i[r])return n[r]>i[r]^t?1:-1;return a==c?0:a>c^t?1:-1};h.div=function(e){var t=this,o=t.constructor,n=t.c,i=(e=new o(e)).c,r=t.s==e.s?1:-1,s=o.DP;if(s!==~~s||s<0||s>O)throw Error(ne);if(!i[0])throw Error(Fe);if(!n[0])return e.s=r,e.c=[e.e=0],e;var a,c,l,M,f,S=i.slice(),re=a=i.length,De=n.length,g=n.slice(0,a),_=g.length,N=e,oe=N.c=[],ae=0,B=s+(N.e=t.e-e.e)+1;for(N.s=r,r=B<0?0:B,S.unshift(0);_++<a;)g.push(0);do{for(l=0;l<10;l++){if(a!=(_=g.length))M=a>_?1:-1;else for(f=-1,M=0;++f<a;)if(i[f]!=g[f]){M=i[f]>g[f]?1:-1;break}if(M<0){for(c=_==a?i:S;_;){if(g[--_]<c[_]){for(f=_;f&&!g[--f];)g[f]=9;--g[f],g[_]+=10}g[_]-=c[_]}for(;!g[0];)g.shift()}else break}oe[ae++]=M?l:++l,g[0]&&M?g[_]=n[re]||0:g=[n[re]]}while((re++<De||g[0]!==y)&&r--);return!oe[0]&&ae!=1&&(oe.shift(),N.e--,B--),ae>B&&q(N,B,o.RM,g[0]!==y),N};h.eq=function(e){return this.cmp(e)===0};h.gt=function(e){return this.cmp(e)>0};h.gte=function(e){return this.cmp(e)>-1};h.lt=function(e){return this.cmp(e)<0};h.lte=function(e){return this.cmp(e)<1};h.minus=h.sub=function(e){var t,o,n,i,r=this,s=r.constructor,a=r.s,c=(e=new s(e)).s;if(a!=c)return e.s=-c,r.plus(e);var l=r.c.slice(),M=r.e,f=e.c,S=e.e;if(!l[0]||!f[0])return f[0]?e.s=-c:l[0]?e=new s(r):e.s=1,e;if(a=M-S){for((i=a<0)?(a=-a,n=l):(S=M,n=f),n.reverse(),c=a;c--;)n.push(0);n.reverse()}else for(o=((i=l.length<f.length)?l:f).length,a=c=0;c<o;c++)if(l[c]!=f[c]){i=l[c]<f[c];break}if(i&&(n=l,l=f,f=n,e.s=-e.s),(c=(o=f.length)-(t=l.length))>0)for(;c--;)l[t++]=0;for(c=t;o>a;){if(l[--o]<f[o]){for(t=o;t&&!l[--t];)l[t]=9;--l[t],l[o]+=10}l[o]-=f[o]}for(;l[--c]===0;)l.pop();for(;l[0]===0;)l.shift(),--S;return l[0]||(e.s=1,l=[S=0]),e.c=l,e.e=S,e};h.mod=function(e){var t,o=this,n=o.constructor,i=o.s,r=(e=new n(e)).s;if(!e.c[0])throw Error(Fe);return o.s=e.s=1,t=e.cmp(o)==1,o.s=i,e.s=r,t?new n(o):(i=n.DP,r=n.RM,n.DP=n.RM=0,o=o.div(e),n.DP=i,n.RM=r,this.minus(o.times(e)))};h.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e};h.plus=h.add=function(e){var t,o,n,i=this,r=i.constructor;if(e=new r(e),i.s!=e.s)return e.s=-e.s,i.minus(e);var s=i.e,a=i.c,c=e.e,l=e.c;if(!a[0]||!l[0])return l[0]||(a[0]?e=new r(i):e.s=i.s),e;if(a=a.slice(),t=s-c){for(t>0?(c=s,n=l):(t=-t,n=a),n.reverse();t--;)n.push(0);n.reverse()}for(a.length-l.length<0&&(n=l,l=a,a=n),t=l.length,o=0;t;a[t]%=10)o=(a[--t]=a[t]+l[t]+o)/10|0;for(o&&(a.unshift(o),++c),t=a.length;a[--t]===0;)a.pop();return e.c=a,e.e=c,e};h.pow=function(e){var t=this,o=new t.constructor("1"),n=o,i=e<0;if(e!==~~e||e<-ye||e>ye)throw Error(A+"exponent");for(i&&(e=-e);e&1&&(n=n.times(t)),e>>=1,!!e;)t=t.times(t);return i?o.div(n):n};h.prec=function(e,t){if(e!==~~e||e<1||e>O)throw Error(A+"precision");return q(new this.constructor(this),e,t)};h.round=function(e,t){if(e===y)e=0;else if(e!==~~e||e<-O||e>O)throw Error(ne);return q(new this.constructor(this),e+this.e+1,t)};h.sqrt=function(){var e,t,o,n=this,i=n.constructor,r=n.s,s=n.e,a=new i("0.5");if(!n.c[0])return new i(n);if(r<0)throw Error(Y+"No square root");r=Math.sqrt(+I(n,!0,!0)),r===0||r===1/0?(t=n.c.join(""),t.length+s&1||(t+="0"),r=Math.sqrt(t),s=((s+1)/2|0)-(s<0||s&1),e=new i((r==1/0?"5e":(r=r.toExponential()).slice(0,r.indexOf("e")+1))+s)):e=new i(r+""),s=e.e+(i.DP+=4);do o=e,e=a.times(o.plus(n.div(o)));while(o.c.slice(0,s).join("")!==e.c.slice(0,s).join(""));return q(e,(i.DP-=4)+e.e+1,i.RM)};h.times=h.mul=function(e){var t,o=this,n=o.constructor,i=o.c,r=(e=new n(e)).c,s=i.length,a=r.length,c=o.e,l=e.e;if(e.s=o.s==e.s?1:-1,!i[0]||!r[0])return e.c=[e.e=0],e;for(e.e=c+l,s<a&&(t=i,i=r,r=t,l=s,s=a,a=l),t=new Array(l=s+a);l--;)t[l]=0;for(c=a;c--;){for(a=0,l=s+c;l>c;)a=t[l]+r[c]*i[l-c-1]+a,t[l--]=a%10,a=a/10|0;t[l]=a}for(a?++e.e:t.shift(),c=t.length;!t[--c];)t.pop();return e.c=t,e};h.toExponential=function(e,t){var o=this,n=o.c[0];if(e!==y){if(e!==~~e||e<0||e>O)throw Error(ne);for(o=q(new o.constructor(o),++e,t);o.c.length<e;)o.c.push(0)}return I(o,!0,!!n)};h.toFixed=function(e,t){var o=this,n=o.c[0];if(e!==y){if(e!==~~e||e<0||e>O)throw Error(ne);for(o=q(new o.constructor(o),e+o.e+1,t),e=e+o.e+1;o.c.length<e;)o.c.push(0)}return I(o,!1,!!n)};h[Symbol.for("nodejs.util.inspect.custom")]=h.toJSON=h.toString=function(){var e=this,t=e.constructor;return I(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])};h.toNumber=function(){var e=+I(this,!0,!0);if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(Y+"Imprecise conversion");return e};h.toPrecision=function(e,t){var o=this,n=o.constructor,i=o.c[0];if(e!==y){if(e!==~~e||e<1||e>O)throw Error(A+"precision");for(o=q(new n(o),e,t);o.c.length<e;)o.c.push(0)}return I(o,e<=o.e||o.e<=n.NE||o.e>=n.PE,!!i)};h.valueOf=function(){var e=this,t=e.constructor;if(t.strict===!0)throw Error(Y+"valueOf disallowed");return I(e,e.e<=t.NE||e.e>=t.PE,!0)};var He=Se(),F=He;function ze(e,t){e&1&&V(0,"div",7)}function Qe(e,t){if(e&1&&(p(0,"div")(1,"div")(2,"strong"),m(3),u()(),p(4,"div",8),m(5,"3,"),u(),p(6,"div",8),m(7),u()()),e&2){let o=T();d(3),J("\u03C0 (",o.n," decimales):"),d(4),U(o.piDecimals)}}var Te=(()=>{let t=class t{constructor(){this.n=10,this.piDecimals="",this.decimalPartLength=100,this.calculating=!1,this.calculatingArctanMessage="",this.calculatingTermMessage=""}calculatePi(n){return H(this,null,function*(){F.DP=n+10;let i=performance.now();this.calculatingArctanMessage="Calculando arctan(1/5)";let r=yield this.arctan(new F(1).div(5),n+10);this.calculatingArctanMessage="Calculando arctan(1/239)";let s=yield this.arctan(new F(1).div(239),n+10),a=new F(4).times(new F(4).times(r).minus(s)),c=performance.now();return this.calculatingArctanMessage="",this.calculatingTermMessage=`Tiempo total: ${(c-i)/1e3} s.`,a.toFixed(n,F.roundDown)})}arctan(n,i){return H(this,null,function*(){let r=new F(0),s=n,a=n.times(n),c=1,l=new F(10).pow(-i);for(;s.abs().gt(l);)(c-1)/2%2==0?r=r.plus(s.div(c)):r=r.minus(s.div(c)),c=c+=2,s=s.times(a),this.calculatingTermMessage=`T\xE9rmino actual: ${s.toExponential(6)}, meta de precisi\xF3n: ${l.toString()}`,yield this.sleep(0);return r})}onCalculate(){return H(this,null,function*(){this.calculating=!0;let n=yield this.calculatePi(this.n),i=n.substring(2,n.length),r=[];for(let s=0;s<this.n/this.decimalPartLength;s++)r.push(i.substring(s*this.decimalPartLength,(s+1)*this.decimalPartLength));this.piDecimals=r.join(" "),this.calculating=!1})}sleep(n){return new Promise(i=>setTimeout(i,n))}};t.\u0275fac=function(i){return new(i||t)},t.\u0275cmp=C({type:t,selectors:[["app-pi-decimal"]],standalone:!0,features:[P],decls:17,vars:5,consts:[[1,"widget-container"],[1,"widget-title"],["for","decimals"],["id","decimals","type","number","min","1","max","1000",3,"ngModelChange","ngModel"],[3,"click"],["class","loader",4,"ngIf"],[4,"ngIf"],[1,"loader"],[1,"decimal-result"]],template:function(i,r){i&1&&(p(0,"h2"),m(1,"Calculadora de decimales de \u03C0"),u(),p(2,"div",0)(3,"div",1),m(4,"Calculadora decimales de \u03C0"),u(),p(5,"div")(6,"label",2),m(7,"N\xFAmero de decimales: "),u(),p(8,"input",3),W("ngModelChange",function(a){return D(r.n,a)||(r.n=a),a}),u(),p(9,"button",4),w("click",function(){return r.onCalculate()}),m(10,"Calcular"),u(),R(11,ze,1,0,"div",5),p(12,"div"),m(13),u(),p(14,"div"),m(15),u(),R(16,Qe,8,2,"div",6),u()()),i&2&&(d(8),k("ngModel",r.n),d(3),E("ngIf",r.calculating),d(2),U(r.calculatingArctanMessage),d(2),U(r.calculatingTermMessage),d(),E("ngIf",r.piDecimals))},dependencies:[L,Z,ee,K,_e,we,$,fe],styles:[".decimal-result[_ngcontent-%COMP%]{font-size:small;font-family:Courier New,Courier,monospace}.loader[_ngcontent-%COMP%]{border:8px solid #f3f3f3;border-top:8px solid #3498db;border-radius:50%;width:24px;height:24px;animation:_ngcontent-%COMP%_spin 2s linear infinite;display:inline-block}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"]});let e=t;return e})();var Ue=[{path:"",component:be,children:[{path:"graph-plotter",component:te},{path:"prime-decomposition",component:ie},{path:"pi-decimals",component:Te}]}],ke=(()=>{let t=class t{};t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=Q({type:t}),t.\u0275inj=z({imports:[X.forChild(Ue),X]});let e=t;return e})();var kt=(()=>{let t=class t{};t.\u0275fac=function(i){return new(i||t)},t.\u0275mod=Q({type:t}),t.\u0275inj=z({imports:[de,ge.forChild(),Ee,L,X,ke,te,ie]});let e=t;return e})();export{kt as ToolsModule};