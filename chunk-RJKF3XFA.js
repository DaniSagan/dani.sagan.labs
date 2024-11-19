import{F as M,G as T,H as f,Q as w,g as y,ua as E,x as g,y as u,z as p}from"./chunk-VMYBRUYY.js";var D=["graphCanvas"],C=(()=>{let o=class o{constructor(){this.xMin=-10,this.xMax=10,this.yMin=-10,this.yMax=10,this.gradientThreshold=1e6,this.functions=[]}ngOnInit(){this.context=this.canvas.nativeElement.getContext("2d")}drawGraph(){this.clear(),this.drawAxes(),this.functions.forEach(t=>this.drawFunction(t))}clear(){this.context.clearRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height),this.context.fillStyle="white",this.context.fillRect(0,0,this.canvas.nativeElement.width,this.canvas.nativeElement.height)}drawAxes(){let t=this.xToPixel(0),i=this.yToPixel(0);this.context.beginPath(),this.context.strokeStyle="gray",this.context.moveTo(0,i),this.context.lineTo(this.canvas.nativeElement.width,i),this.context.moveTo(t,0),this.context.lineTo(t,this.canvas.nativeElement.height),this.context.stroke()}drawNumberDivisions(){let t=this.xMax-this.xMin,i=this.yMax-this.yMin,e=100,n=this.pixelToX(e)-this.pixelToX(0);console.log("minDivisionX",n);let h=this.pixelToY(e)-this.pixelToY(0),l=10**Math.ceil(Math.log10(n));console.log("minDivision10X",l);let v=10**Math.ceil(Math.log10(h)),r=10**Math.ceil(Math.log10(this.xMin)),d=10**Math.ceil(Math.log10(this.yMin));for(let s=0;s<10;s++){let a=this.xToPixel(r+s*l);console.log(a),this.drawHorizontalLine(a,"gray")}}drawHorizontalLine(t,i){this.context.beginPath(),this.context.strokeStyle=i,this.context.moveTo(0,t),this.context.lineTo(this.canvas.nativeElement.width,t),this.context.stroke()}drawVerticalLine(t,i){this.context.beginPath(),this.context.strokeStyle=i,this.context.moveTo(t,0),this.context.lineTo(t,this.canvas.nativeElement.height),this.context.stroke()}drawFunction(t){let i=this.canvas.nativeElement.width,e=this.canvas.nativeElement.height;this.context.beginPath(),this.context.strokeStyle="blue",this.context.fillStyle=t.color;for(let n=0;n<i;n++)for(let h=0;h<e;h++){let l=this.pixelToX(n),v=this.pixelToX(n+1),r=this.pixelToY(h),d=this.pixelToY(h+1),s,a,x;try{s=t.fn(l,r),a=t.fn(v,r),x=t.fn(l,d)}catch(m){throw console.error("Error evaluando la f\xF3rmula:",m),m}(s*a<=0||s*x<=0)&&s*a>-this.gradientThreshold&&s*x>=-this.gradientThreshold&&this.context.fillRect(n,h,1,1)}this.context.stroke()}draw(t){t(this.context)}setBounds(t,i,e,n){this.xMin=t,this.xMax=i,this.yMin=e,this.yMax=n}pixelToX(t){let i=this.canvas.nativeElement.width,e=this.xMax-this.xMin;return this.xMin+t*e/i}pixelToY(t){let i=this.canvas.nativeElement.height,e=this.yMax-this.yMin;return this.yMin+(i-t)*e/i}pixelToXY(t){return{x:this.pixelToX(t.x),y:this.pixelToY(t.y)}}yToPixel(t){let i=this.canvas.nativeElement.height,e=this.yMax-this.yMin;return i-(t-this.yMin)*(i/e)}xToPixel(t){let i=this.canvas.nativeElement.width,e=this.xMax-this.xMin;return(t-this.xMin)*(i/e)}xyToPixel(t){return{x:this.xToPixel(t.x),y:this.yToPixel(t.y)}}};o.\u0275fac=function(i){return new(i||o)},o.\u0275cmp=y({type:o,selectors:[["app-implicit-curve-graph"]],viewQuery:function(i,e){if(i&1&&M(D,7),i&2){let n;T(n=f())&&(e.canvas=n.first)}},standalone:!0,features:[w],decls:3,vars:0,consts:[["graphCanvas",""],["width","600","height","600"]],template:function(i,e){i&1&&(g(0,"div"),p(1,"canvas",1,0),u())},dependencies:[E],styles:["canvas[_ngcontent-%COMP%]{border:1px solid black;display:block;margin-top:20px;width:100%}"]});let c=o;return c})(),P=class{constructor(o,X){this.fn=o,this.color=X}};export{C as a,P as b};