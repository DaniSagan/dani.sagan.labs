import{h as Pe,j as se}from"./chunk-Q3KAW73M.js";import{$ as Y,A as R,B as X,C as j,E as p,F as oe,G as ae,I as C,J as E,K as P,L as b,M as F,Q as ge,R as xe,S as ve,W as Me,X as we,Y as _e,Z as ye,_ as ee,a as ie,aa as Q,ba as H,c as ne,ca as z,d as y,da as Ce,e as re,ea as Ee,fa as W,g,h as x,k as d,n as Z,o as S,s as h,t as u,u as V,v as K,w,x as G,z as $}from"./chunk-BELQJ64D.js";var Oe=["canvas"];function Ae(e,i){if(e&1){let o=K();h(0,"div")(1,"label",12),p(2),u(),h(3,"input",13),w("input",function(t){let r=g(o).index,s=G();return x(s.updateEquations(t,r))}),u(),h(4,"label",12),p(5,"Color:"),u(),h(6,"input",14),P("ngModelChange",function(t){let r=g(o).index,s=G();return E(s.colors[r],t)||(s.colors[r]=t),x(t)}),w("change",function(t){let r=g(o).index,s=G();return x(s.updateEquations(t,r))}),u(),h(7,"button",10),w("click",function(){let t=g(o).index,r=G();return x(r.removeEquation(t))}),p(8,"Eliminar"),u()()}if(e&2){let o=i.$implicit,n=i.index,t=G();d(),$("for","equation",n,""),d(),ae("Ecuaci\xF3n ",n+1,":"),d(),$("id","equation",n,""),S("value",o),d(),$("for","color",n,""),d(2),$("id","color",n,""),C("ngModel",t.colors[n])}}var le=(()=>{let i=class i{constructor(){this.equations=["x^2"],this.colors=["#00FF00"],this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.scaleFactor=1,this.centerX=0,this.centerY=0}ngOnInit(){this.ctx=this.canvas.nativeElement.getContext("2d"),this.drawGraph()}drawGraph(){let n=this.canvas.nativeElement.width,t=this.canvas.nativeElement.height;this.ctx.clearRect(0,0,n,t),this.ctx.fillStyle="#000000",this.ctx.fillRect(0,0,n,t),this.drawAxes(),this.equations.forEach((r,s)=>{this.drawEquation(r,this.colors[s]||"#FFFFFF")})}drawAxes(){let n=this.canvas.nativeElement.width,t=this.canvas.nativeElement.height;this.ctx.strokeStyle="#FFFFFF",this.ctx.lineWidth=1,this.ctx.beginPath(),this.ctx.moveTo(0,this.yToPixel(0)),this.ctx.lineTo(n,this.yToPixel(0)),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(this.xToPixel(0),0),this.ctx.lineTo(this.xToPixel(0),t),this.ctx.stroke()}drawEquation(n,t){let r=this.canvas.nativeElement.width;this.ctx.strokeStyle=t,this.ctx.lineWidth=2,this.ctx.beginPath();let s=null,l=null;for(let a=0;a<r;a++){let c=this.pixelToX(a),M=this.evaluateEquation(n,c);if(M!=null&&!isNaN(M)){let m=this.yToPixel(M);s!==null&&l!==null?this.ctx.lineTo(a,m):this.ctx.moveTo(a,m),s=a,l=m}}this.ctx.stroke()}pixelToX(n){let t=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return this.xMin+n*r/t}pixelToY(n){let t=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return this.yMin+n*r/t}yToPixel(n){let t=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return t-(n-this.yMin)*(t/r)}xToPixel(n){let t=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return(n-this.xMin)*(t/r)}evaluateEquation(n,t){try{let r=n.replace(/\^/g,"**").replace(new RegExp("(?<=\\W|^)sqrt(?=\\W)","g"),"Math.sqrt").replace(new RegExp("(?<=\\W|^)cos(?=\\W)","g"),"Math.cos").replace(new RegExp("(?<=\\W|^)sin(?=\\W)","g"),"Math.sin").replace(new RegExp("(?<=\\W|^)tan(?=\\W)","g"),"Math.tan").replace(new RegExp("(?<=\\W|^)ln(?=\\W)","g"),"Math.log").replace(new RegExp("(?<=\\W|^)abs(?=\\W)","g"),"Math.abs").replace(new RegExp("(?<=\\W|^)e(?=\\W|$)","g"),"(Math.E)").replace(new RegExp("(?<=\\W|^)pi(?=\\W|$)","g"),"(Math.PI)").replace(/x/g,`(${t})`);return Function(`"use strict"; return (${r})`)()}catch{return}}handleWheel(n){n.preventDefault();let t=1.1;n.deltaY<0?this.scaleFactor/=t:this.scaleFactor*=t,this.drawGraph()}updateLimits(){this.drawGraph()}updateEquations(n,t){let r=n.target;this.equations[t]=r.value,this.drawGraph()}addEquation(){this.equations.push(""),this.colors.push("#FFFFFF")}removeEquation(n){this.equations.splice(n,1),this.colors.splice(n,1),this.drawGraph()}resetGraph(){this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.scaleFactor=1,this.centerX=0,this.centerY=0,this.equations=["x^2"],this.colors=["#00FF00"],this.drawGraph()}trackByIndex(n,t){return n}};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-graph-plotter"]],viewQuery:function(t,r){if(t&1&&R(Oe,7),t&2){let s;X(s=j())&&(r.canvas=s.first)}},standalone:!0,features:[b],decls:22,vars:6,consts:[["canvas",""],["for","xMin"],["id","xMin","type","number",3,"ngModelChange","change","ngModel"],["for","xMax"],["id","xMax","type","number",3,"ngModelChange","change","ngModel"],["for","yMin"],["id","yMin","type","number",3,"ngModelChange","change","ngModel"],["for","yMax"],["id","yMax","type","number",3,"ngModelChange","change","ngModel"],[4,"ngFor","ngForOf","ngForTrackBy"],[3,"click"],["width","800","height","600",3,"wheel"],[3,"for"],["type","text",3,"input","id","value"],["type","color",3,"ngModelChange","change","id","ngModel"]],template:function(t,r){if(t&1){let s=K();h(0,"h2"),p(1,"Gr\xE1ficas de Funciones"),u(),h(2,"div")(3,"label",1),p(4,"X M\xEDn:"),u(),h(5,"input",2),P("ngModelChange",function(a){return g(s),E(r.xMin,a)||(r.xMin=a),x(a)}),w("change",function(){return g(s),x(r.updateLimits())}),u(),h(6,"label",3),p(7,"X M\xE1x:"),u(),h(8,"input",4),P("ngModelChange",function(a){return g(s),E(r.xMax,a)||(r.xMax=a),x(a)}),w("change",function(){return g(s),x(r.updateLimits())}),u(),h(9,"label",5),p(10,"Y M\xEDn:"),u(),h(11,"input",6),P("ngModelChange",function(a){return g(s),E(r.yMin,a)||(r.yMin=a),x(a)}),w("change",function(){return g(s),x(r.updateLimits())}),u(),h(12,"label",7),p(13,"Y M\xE1x:"),u(),h(14,"input",8),P("ngModelChange",function(a){return g(s),E(r.yMax,a)||(r.yMax=a),x(a)}),w("change",function(){return g(s),x(r.updateLimits())}),u()(),Z(15,Ae,9,11,"div",9),h(16,"button",10),w("click",function(){return g(s),x(r.addEquation())}),p(17,"Agregar Ecuaci\xF3n"),u(),h(18,"button",10),w("click",function(){return g(s),x(r.resetGraph())}),p(19,"Reiniciar Gr\xE1fica"),u(),h(20,"canvas",11,0),w("wheel",function(a){return g(s),x(r.handleWheel(a))}),u()}t&2&&(d(5),C("ngModel",r.xMin),d(3),C("ngModel",r.xMax),d(3),C("ngModel",r.yMin),d(3),C("ngModel",r.yMax),d(),S("ngForOf",r.equations)("ngForTrackBy",r.trackByIndex))},dependencies:[W,Y,z,Q,H,ge],styles:["canvas[_ngcontent-%COMP%]{border:1px solid #00FFFF;display:block;margin-top:20px}input[type=text][_ngcontent-%COMP%], input[type=number][_ngcontent-%COMP%], input[type=color][_ngcontent-%COMP%]{margin:5px;padding:5px}button[_ngcontent-%COMP%]{margin:5px;padding:5px;background-color:#444;color:#fff;border:none;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#666}"]});let e=i;return e})();var ce=(()=>{let i=class i{constructor(){}ngOnInit(){}};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-prime-decomposition-article"]],standalone:!0,features:[b],decls:3,vars:0,template:function(t,r){t&1&&(h(0,"h2"),p(1,"Factorizaci\xF3n en primos"),u(),V(2,"app-prime-decomposition"))},dependencies:[Pe]});let e=i;return e})();var Le=()=>["/tools/prime-decomposition"],ue=()=>["active"],he=()=>({exact:!0}),qe=()=>["/tools/graph-plotter"],Ne=()=>["/tools/pi-decimals"],Be=()=>["/tools/implicit-curve-graph"],Fe=(()=>{let i=class i{};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-tools-navbar"]],standalone:!0,features:[b],decls:20,vars:24,consts:[[1,"nav-items"],[1,"subsection"],[3,"routerLink","routerLinkActive","routerLinkActiveOptions"]],template:function(t,r){t&1&&(h(0,"h2"),p(1,"Herramientas"),u(),h(2,"div",0)(3,"ul")(4,"li")(5,"div",1),p(6,"Otros"),u(),h(7,"ul")(8,"li")(9,"a",2),p(10,"Factorizaci\xF3n en primos"),u()(),h(11,"li")(12,"a",2),p(13,"Graficador de funciones"),u()(),h(14,"li")(15,"a",2),p(16,"Calculadora de decimales de pi"),u()(),h(17,"li")(18,"a",2),p(19,"Graficador Curvas Impl\xEDcitas"),u()()()()()()),t&2&&(d(9),S("routerLink",F(12,Le))("routerLinkActive",F(13,ue))("routerLinkActiveOptions",F(14,he)),d(3),S("routerLink",F(15,qe))("routerLinkActive",F(16,ue))("routerLinkActiveOptions",F(17,he)),d(3),S("routerLink",F(18,Ne))("routerLinkActive",F(19,ue))("routerLinkActiveOptions",F(20,he)),d(3),S("routerLink",F(21,Be))("routerLinkActive",F(22,ue))("routerLinkActiveOptions",F(23,he)))},dependencies:[_e,ye],styles:[".nav-items[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style-type:none;margin:0 auto;padding:0}.nav-items[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{min-height:30px}.nav-items[_ngcontent-%COMP%]   .subsection[_ngcontent-%COMP%]{padding:5px 0;margin:5px 0;color:#000;font-weight:700}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:5px;margin:5px;text-decoration:none;min-width:100px;color:#000;font-weight:400}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#333;color:#fff}.nav-items[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background-color:#04aa6d;color:#fff}"]});let e=i;return e})();var Te=(()=>{let i=class i{};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-tools-content"]],standalone:!0,features:[b],decls:5,vars:0,consts:[[1,"article-with-sidebar"],[1,"sidebar"],[1,"body-text"]],template:function(t,r){t&1&&(h(0,"div",0)(1,"div",1),V(2,"app-tools-navbar"),u(),h(3,"div",2),V(4,"router-outlet"),u()())},dependencies:[Fe,we]});let e=i;return e})();var Re=20,Xe=1,A=1e6,Se=1e6,je=-7,Ye=21,Qe=!1,te="[big.js] ",L=te+"Invalid ",pe=L+"decimal places",He=L+"rounding mode",Ve=te+"Division by zero",f={},k=void 0,ze=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function We(){function e(i){var o=this;if(!(o instanceof e))return i===k?We():new e(i);if(i instanceof e)o.s=i.s,o.e=i.e,o.c=i.c.slice();else{if(typeof i!="string"){if(e.strict===!0&&typeof i!="bigint")throw TypeError(L+"value");i=i===0&&1/i<0?"-0":String(i)}Ue(o,i)}o.constructor=e}return e.prototype=f,e.DP=Re,e.RM=Xe,e.NE=je,e.PE=Ye,e.strict=Qe,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function Ue(e,i){var o,n,t;if(!ze.test(i))throw Error(L+"number");for(e.s=i.charAt(0)=="-"?(i=i.slice(1),-1):1,(o=i.indexOf("."))>-1&&(i=i.replace(".","")),(n=i.search(/e/i))>0?(o<0&&(o=n),o+=+i.slice(n+1),i=i.substring(0,n)):o<0&&(o=i.length),t=i.length,n=0;n<t&&i.charAt(n)=="0";)++n;if(n==t)e.c=[e.e=0];else{for(;t>0&&i.charAt(--t)=="0";);for(e.e=o-n-1,e.c=[],o=0;n<=t;)e.c[o++]=+i.charAt(n++)}return e}function q(e,i,o,n){var t=e.c;if(o===k&&(o=e.constructor.RM),o!==0&&o!==1&&o!==2&&o!==3)throw Error(He);if(i<1)n=o===3&&(n||!!t[0])||i===0&&(o===1&&t[0]>=5||o===2&&(t[0]>5||t[0]===5&&(n||t[1]!==k))),t.length=1,n?(e.e=e.e-i+1,t[0]=1):t[0]=e.e=0;else if(i<t.length){if(n=o===1&&t[i]>=5||o===2&&(t[i]>5||t[i]===5&&(n||t[i+1]!==k||t[i-1]&1))||o===3&&(n||!!t[0]),t.length=i,n){for(;++t[--i]>9;)if(t[i]=0,i===0){++e.e,t.unshift(1);break}}for(i=t.length;!t[--i];)t.pop()}return e}function N(e,i,o){var n=e.e,t=e.c.join(""),r=t.length;if(i)t=t.charAt(0)+(r>1?"."+t.slice(1):"")+(n<0?"e":"e+")+n;else if(n<0){for(;++n;)t="0"+t;t="0."+t}else if(n>0)if(++n>r)for(n-=r;n--;)t+="0";else n<r&&(t=t.slice(0,n)+"."+t.slice(n));else r>1&&(t=t.charAt(0)+"."+t.slice(1));return e.s<0&&o?"-"+t:t}f.abs=function(){var e=new this.constructor(this);return e.s=1,e};f.cmp=function(e){var i,o=this,n=o.c,t=(e=new o.constructor(e)).c,r=o.s,s=e.s,l=o.e,a=e.e;if(!n[0]||!t[0])return n[0]?r:t[0]?-s:0;if(r!=s)return r;if(i=r<0,l!=a)return l>a^i?1:-1;for(s=(l=n.length)<(a=t.length)?l:a,r=-1;++r<s;)if(n[r]!=t[r])return n[r]>t[r]^i?1:-1;return l==a?0:l>a^i?1:-1};f.div=function(e){var i=this,o=i.constructor,n=i.c,t=(e=new o(e)).c,r=i.s==e.s?1:-1,s=o.DP;if(s!==~~s||s<0||s>A)throw Error(pe);if(!t[0])throw Error(Ve);if(!n[0])return e.s=r,e.c=[e.e=0],e;var l,a,c,M,m,_=t.slice(),O=l=t.length,U=n.length,v=n.slice(0,l),T=v.length,B=e,de=B.c=[],fe=0,J=s+(B.e=i.e-e.e)+1;for(B.s=r,r=J<0?0:J,_.unshift(0);T++<l;)v.push(0);do{for(c=0;c<10;c++){if(l!=(T=v.length))M=l>T?1:-1;else for(m=-1,M=0;++m<l;)if(t[m]!=v[m]){M=t[m]>v[m]?1:-1;break}if(M<0){for(a=T==l?t:_;T;){if(v[--T]<a[T]){for(m=T;m&&!v[--m];)v[m]=9;--v[m],v[T]+=10}v[T]-=a[T]}for(;!v[0];)v.shift()}else break}de[fe++]=M?c:++c,v[0]&&M?v[T]=n[O]||0:v=[n[O]]}while((O++<U||v[0]!==k)&&r--);return!de[0]&&fe!=1&&(de.shift(),B.e--,J--),fe>J&&q(B,J,o.RM,v[0]!==k),B};f.eq=function(e){return this.cmp(e)===0};f.gt=function(e){return this.cmp(e)>0};f.gte=function(e){return this.cmp(e)>-1};f.lt=function(e){return this.cmp(e)<0};f.lte=function(e){return this.cmp(e)<1};f.minus=f.sub=function(e){var i,o,n,t,r=this,s=r.constructor,l=r.s,a=(e=new s(e)).s;if(l!=a)return e.s=-a,r.plus(e);var c=r.c.slice(),M=r.e,m=e.c,_=e.e;if(!c[0]||!m[0])return m[0]?e.s=-a:c[0]?e=new s(r):e.s=1,e;if(l=M-_){for((t=l<0)?(l=-l,n=c):(_=M,n=m),n.reverse(),a=l;a--;)n.push(0);n.reverse()}else for(o=((t=c.length<m.length)?c:m).length,l=a=0;a<o;a++)if(c[a]!=m[a]){t=c[a]<m[a];break}if(t&&(n=c,c=m,m=n,e.s=-e.s),(a=(o=m.length)-(i=c.length))>0)for(;a--;)c[i++]=0;for(a=i;o>l;){if(c[--o]<m[o]){for(i=o;i&&!c[--i];)c[i]=9;--c[i],c[o]+=10}c[o]-=m[o]}for(;c[--a]===0;)c.pop();for(;c[0]===0;)c.shift(),--_;return c[0]||(e.s=1,c=[_=0]),e.c=c,e.e=_,e};f.mod=function(e){var i,o=this,n=o.constructor,t=o.s,r=(e=new n(e)).s;if(!e.c[0])throw Error(Ve);return o.s=e.s=1,i=e.cmp(o)==1,o.s=t,e.s=r,i?new n(o):(t=n.DP,r=n.RM,n.DP=n.RM=0,o=o.div(e),n.DP=t,n.RM=r,this.minus(o.times(e)))};f.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e};f.plus=f.add=function(e){var i,o,n,t=this,r=t.constructor;if(e=new r(e),t.s!=e.s)return e.s=-e.s,t.minus(e);var s=t.e,l=t.c,a=e.e,c=e.c;if(!l[0]||!c[0])return c[0]||(l[0]?e=new r(t):e.s=t.s),e;if(l=l.slice(),i=s-a){for(i>0?(a=s,n=c):(i=-i,n=l),n.reverse();i--;)n.push(0);n.reverse()}for(l.length-c.length<0&&(n=c,c=l,l=n),i=c.length,o=0;i;l[i]%=10)o=(l[--i]=l[i]+c[i]+o)/10|0;for(o&&(l.unshift(o),++a),i=l.length;l[--i]===0;)l.pop();return e.c=l,e.e=a,e};f.pow=function(e){var i=this,o=new i.constructor("1"),n=o,t=e<0;if(e!==~~e||e<-Se||e>Se)throw Error(L+"exponent");for(t&&(e=-e);e&1&&(n=n.times(i)),e>>=1,!!e;)i=i.times(i);return t?o.div(n):n};f.prec=function(e,i){if(e!==~~e||e<1||e>A)throw Error(L+"precision");return q(new this.constructor(this),e,i)};f.round=function(e,i){if(e===k)e=0;else if(e!==~~e||e<-A||e>A)throw Error(pe);return q(new this.constructor(this),e+this.e+1,i)};f.sqrt=function(){var e,i,o,n=this,t=n.constructor,r=n.s,s=n.e,l=new t("0.5");if(!n.c[0])return new t(n);if(r<0)throw Error(te+"No square root");r=Math.sqrt(+N(n,!0,!0)),r===0||r===1/0?(i=n.c.join(""),i.length+s&1||(i+="0"),r=Math.sqrt(i),s=((s+1)/2|0)-(s<0||s&1),e=new t((r==1/0?"5e":(r=r.toExponential()).slice(0,r.indexOf("e")+1))+s)):e=new t(r+""),s=e.e+(t.DP+=4);do o=e,e=l.times(o.plus(n.div(o)));while(o.c.slice(0,s).join("")!==e.c.slice(0,s).join(""));return q(e,(t.DP-=4)+e.e+1,t.RM)};f.times=f.mul=function(e){var i,o=this,n=o.constructor,t=o.c,r=(e=new n(e)).c,s=t.length,l=r.length,a=o.e,c=e.e;if(e.s=o.s==e.s?1:-1,!t[0]||!r[0])return e.c=[e.e=0],e;for(e.e=a+c,s<l&&(i=t,t=r,r=i,c=s,s=l,l=c),i=new Array(c=s+l);c--;)i[c]=0;for(a=l;a--;){for(l=0,c=s+a;c>a;)l=i[c]+r[a]*t[c-a-1]+l,i[c--]=l%10,l=l/10|0;i[c]=l}for(l?++e.e:i.shift(),a=i.length;!i[--a];)i.pop();return e.c=i,e};f.toExponential=function(e,i){var o=this,n=o.c[0];if(e!==k){if(e!==~~e||e<0||e>A)throw Error(pe);for(o=q(new o.constructor(o),++e,i);o.c.length<e;)o.c.push(0)}return N(o,!0,!!n)};f.toFixed=function(e,i){var o=this,n=o.c[0];if(e!==k){if(e!==~~e||e<0||e>A)throw Error(pe);for(o=q(new o.constructor(o),e+o.e+1,i),e=e+o.e+1;o.c.length<e;)o.c.push(0)}return N(o,!1,!!n)};f[Symbol.for("nodejs.util.inspect.custom")]=f.toJSON=f.toString=function(){var e=this,i=e.constructor;return N(e,e.e<=i.NE||e.e>=i.PE,!!e.c[0])};f.toNumber=function(){var e=+N(this,!0,!0);if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(te+"Imprecise conversion");return e};f.toPrecision=function(e,i){var o=this,n=o.constructor,t=o.c[0];if(e!==k){if(e!==~~e||e<1||e>A)throw Error(L+"precision");for(o=q(new n(o),e,i);o.c.length<e;)o.c.push(0)}return N(o,e<=o.e||o.e<=n.NE||o.e>=n.PE,!!t)};f.valueOf=function(){var e=this,i=e.constructor;if(i.strict===!0)throw Error(te+"valueOf disallowed");return N(e,e.e<=i.NE||e.e>=i.PE,!0)};var Je=We(),D=Je;function Ze(e,i){e&1&&V(0,"div",7)}function Ke(e,i){if(e&1&&(h(0,"div")(1,"div")(2,"strong"),p(3),u()(),h(4,"div",8),p(5,"3,"),u(),h(6,"div",8),p(7),u()()),e&2){let o=G();d(3),ae("\u03C0 (",o.n," decimales):"),d(4),oe(o.piDecimals)}}var ke=(()=>{let i=class i{constructor(){this.n=10,this.piDecimals="",this.decimalPartLength=100,this.calculating=!1,this.calculatingArctanMessage="",this.calculatingTermMessage=""}calculatePi(n){return ie(this,null,function*(){D.DP=n+10;let t=performance.now();this.calculatingArctanMessage="Calculando arctan(1/5)";let r=yield this.arctan(new D(1).div(5),n+10);this.calculatingArctanMessage="Calculando arctan(1/239)";let s=yield this.arctan(new D(1).div(239),n+10),l=new D(4).times(new D(4).times(r).minus(s)),a=performance.now();return this.calculatingArctanMessage="",this.calculatingTermMessage=`Tiempo total: ${(a-t)/1e3} s.`,l.toFixed(n,D.roundDown)})}arctan(n,t){return ie(this,null,function*(){let r=new D(0),s=n,l=n.times(n),a=1,c=new D(10).pow(-t);for(;s.abs().gt(c);)(a-1)/2%2==0?r=r.plus(s.div(a)):r=r.minus(s.div(a)),a=a+=2,s=s.times(l),this.calculatingTermMessage=`T\xE9rmino actual: ${s.toExponential(6)}, meta de precisi\xF3n: ${c.toString()}`,yield this.sleep(0);return r})}onCalculate(){return ie(this,null,function*(){this.calculating=!0;let n=yield this.calculatePi(this.n),t=n.substring(2,n.length),r=[];for(let s=0;s<this.n/this.decimalPartLength;s++)r.push(t.substring(s*this.decimalPartLength,(s+1)*this.decimalPartLength));this.piDecimals=r.join(" "),this.calculating=!1})}sleep(n){return new Promise(t=>setTimeout(t,n))}};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-pi-decimal"]],standalone:!0,features:[b],decls:17,vars:5,consts:[[1,"widget-container"],[1,"widget-title"],["for","decimals"],["id","decimals","type","number","min","1","max","1000",3,"ngModelChange","ngModel"],[3,"click"],["class","loader",4,"ngIf"],[4,"ngIf"],[1,"loader"],[1,"decimal-result"]],template:function(t,r){t&1&&(h(0,"h2"),p(1,"Calculadora de decimales de \u03C0"),u(),h(2,"div",0)(3,"div",1),p(4,"Calculadora decimales de \u03C0"),u(),h(5,"div")(6,"label",2),p(7,"N\xFAmero de decimales: "),u(),h(8,"input",3),P("ngModelChange",function(l){return E(r.n,l)||(r.n=l),l}),u(),h(9,"button",4),w("click",function(){return r.onCalculate()}),p(10,"Calcular"),u(),Z(11,Ze,1,0,"div",5),h(12,"div"),p(13),u(),h(14,"div"),p(15),u(),Z(16,Ke,8,2,"div",6),u()()),t&2&&(d(8),C("ngModel",r.n),d(3),S("ngIf",r.calculating),d(2),oe(r.calculatingArctanMessage),d(2),oe(r.calculatingTermMessage),d(),S("ngIf",r.piDecimals))},dependencies:[W,Y,z,Q,Ee,Ce,H,xe],styles:[".decimal-result[_ngcontent-%COMP%]{font-size:small;font-family:Courier New,Courier,monospace}.loader[_ngcontent-%COMP%]{border:8px solid #f3f3f3;border-top:8px solid #3498db;border-radius:50%;width:24px;height:24px;animation:_ngcontent-%COMP%_spin 2s linear infinite;display:inline-block}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}"]});let e=i;return e})();var $e=["graphCanvas"],De=(()=>{let i=class i{constructor(){this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.gradientThreshold=1e6,this.functions=[]}ngOnInit(){this.context=this.canvas.nativeElement.getContext("2d")}drawGraph(){this.clear(),this.drawAxes(),this.functions.forEach(n=>this.drawFunction(n))}clear(){this.context.clearRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height),this.context.fillStyle="white",this.context.fillRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)}drawAxes(){let n=this.xToPixel(0),t=this.yToPixel(0);this.context.beginPath(),this.context.strokeStyle="gray",this.context.moveTo(0,t),this.context.lineTo(this.canvas.nativeElement.width,t),this.context.moveTo(n,0),this.context.lineTo(n,this.canvas.nativeElement.height),this.context.stroke()}drawFunction(n){let t=this.canvas.nativeElement.width,r=this.canvas.nativeElement.height;this.context.beginPath(),this.context.strokeStyle="blue",this.context.fillStyle=n.color;for(let s=0;s<t;s++)for(let l=0;l<r;l++){let a=this.pixelToX(s),c=this.pixelToX(s+1),M=this.pixelToY(l),m=this.pixelToY(l+1),_,O,U;try{_=n.fn(a,M),O=n.fn(c,M),U=n.fn(a,m)}catch(v){throw console.error("Error evaluando la f\xF3rmula:",v),v}(_*O<=0||_*U<=0)&&_*O>-this.gradientThreshold&&_*U>=-this.gradientThreshold&&this.context.fillRect(s,l,1,1)}this.context.stroke()}setBounds(n,t,r,s){this.xMin=n,this.xMax=t,this.yMin=r,this.yMax=s}pixelToX(n){let t=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return this.xMin+n*r/t}pixelToY(n){let t=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return this.yMin+(t-n)*r/t}yToPixel(n){let t=this.canvas.nativeElement.height,r=this.yMax-this.yMin;return t-(n-this.yMin)*(t/r)}xToPixel(n){let t=this.canvas.nativeElement.width,r=this.xMax-this.xMin;return(n-this.xMin)*(t/r)}};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-implicit-curve-graph"]],viewQuery:function(t,r){if(t&1&&R($e,7),t&2){let s;X(s=j())&&(r.canvas=s.first)}},standalone:!0,features:[b],decls:3,vars:0,consts:[["graphCanvas",""],["width","600","height","600"]],template:function(t,r){t&1&&(h(0,"div"),V(1,"canvas",1,0),u())},dependencies:[W],styles:["canvas[_ngcontent-%COMP%]{border:1px solid black;display:block;margin-top:20px;width:100%}"]});let e=i;return e})(),me=class{constructor(i,o){this.fn=i,this.color=o}};var et=["curveGraph"],Ge=(()=>{let i=class i{constructor(){this.formula="x*x + y*y - 1",this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10}ngAfterViewInit(){this.onRedraw()}onRedraw(){if(this.validateFormula(this.formula)){let n=new Function("x","y",`"use strict"; return ${this.formula}`);this.curveGraph.functions=[new me(n,"red")],this.curveGraph.setBounds(this.xMin,this.xMax,this.yMin,this.yMax),this.curveGraph.drawGraph()}else console.log(`Formula was not valid (${this.formula})`)}validateFormula(n){return!(n.indexOf("x")<0||n.indexOf("y")<0)}};i.\u0275fac=function(t){return new(t||i)},i.\u0275cmp=y({type:i,selectors:[["app-implicit-curve-graph-tool"]],viewQuery:function(t,r){if(t&1&&R(et,7),t&2){let s;X(s=j())&&(r.curveGraph=s.first)}},standalone:!0,features:[b],decls:25,vars:5,consts:[["curveGraph",""],[1,"widget-container"],["for","formula"],["id","formula","placeholder","Ingresa la f\xF3rmula (ej. x*x + y*y - 1)",3,"ngModelChange","ngModel"],["for","xMin"],["id","xMin","type","number",3,"ngModelChange","ngModel"],["for","xMax"],["id","xMax","type","number",3,"ngModelChange","ngModel"],["for","yMin"],["id","yMin","type","number",3,"ngModelChange","ngModel"],["for","yMax"],["id","yMax","type","number",3,"ngModelChange","ngModel"],[3,"click"]],template:function(t,r){if(t&1){let s=K();h(0,"h2"),p(1,"Graficador de Curvas Implicitas"),u(),h(2,"div",1)(3,"div")(4,"label",2),p(5,"Ecuaci\xF3n (f(x, y) = 0): "),u(),h(6,"input",3),P("ngModelChange",function(a){return g(s),E(r.formula,a)||(r.formula=a),x(a)}),u(),h(7,"div")(8,"label",4),p(9,"x Min: "),u(),h(10,"input",5),P("ngModelChange",function(a){return g(s),E(r.xMin,a)||(r.xMin=a),x(a)}),u(),h(11,"label",6),p(12,"x Max: "),u(),h(13,"input",7),P("ngModelChange",function(a){return g(s),E(r.xMax,a)||(r.xMax=a),x(a)}),u()(),h(14,"div")(15,"label",8),p(16,"y Min: "),u(),h(17,"input",9),P("ngModelChange",function(a){return g(s),E(r.yMin,a)||(r.yMin=a),x(a)}),u(),h(18,"label",10),p(19,"y Max: "),u(),h(20,"input",11),P("ngModelChange",function(a){return g(s),E(r.yMax,a)||(r.yMax=a),x(a)}),u()(),h(21,"button",12),w("click",function(){return g(s),x(r.onRedraw())}),p(22,"Redibujar"),u()(),V(23,"app-implicit-curve-graph",null,0),u()}t&2&&(d(6),C("ngModel",r.formula),d(4),C("ngModel",r.xMin),d(3),C("ngModel",r.xMax),d(4),C("ngModel",r.yMin),d(3),C("ngModel",r.yMax))},dependencies:[se,De,W,Y,z,Q,H],styles:["input#formula[_ngcontent-%COMP%]{min-width:30em}"]});let e=i;return e})();var tt=[{path:"",component:Te,children:[{path:"graph-plotter",component:le},{path:"prime-decomposition",component:ce},{path:"pi-decimals",component:ke},{path:"implicit-curve-graph",component:Ge}]}],Ie=(()=>{let i=class i{};i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=re({type:i}),i.\u0275inj=ne({imports:[ee.forChild(tt),ee]});let e=i;return e})();var Xt=(()=>{let i=class i{};i.\u0275fac=function(t){return new(t||i)},i.\u0275mod=re({type:i}),i.\u0275inj=ne({imports:[ve,Me.forChild(),se,W,ee,Ie,le,ce]});let e=i;return e})();export{Xt as ToolsModule};
