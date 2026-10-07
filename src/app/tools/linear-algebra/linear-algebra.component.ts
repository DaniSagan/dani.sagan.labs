import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LINEAR_EXAMPLES, LinearExample, SOURCES } from './linear-examples';
import { clone, determinant, expression, inverse, leastSquares, Matrix, parseMatrix, Q, reduce, Reduction, spectrum, Spectrum } from './linear-math';
import { axisTicks, niceStep, traceContours, ContourSegment } from '../../widgets/implicit-curve-graph/implicit-contours';
import { ParameterStudy, studyParameter } from './parameter-polynomial';
import { MatrixEditorComponent } from '../../shared/matrix-editor/matrix-editor.component';
import { cubeVertices, CUBE_EDGES, planeCubeSection, lineCubeSegment } from './spatial-geometry';

type V = number[];
@Component({selector:'app-linear-algebra',standalone:true,imports:[CommonModule,FormsModule,RouterModule,MatrixEditorComponent],templateUrl:'./linear-algebra.component.html',styleUrls:['../vector-field/vector-field.component.css','./linear-algebra.component.css']})
export class LinearAlgebraComponent implements AfterViewInit,OnDestroy {
  @ViewChild('canvas',{static:true}) canvas!:ElementRef<HTMLCanvasElement>;
  readonly examples=LINEAR_EXAMPLES; readonly sources=SOURCES;
  readonly categories=['Todos',...new Set(LINEAR_EXAMPLES.map(e=>e.category))];
  selected=LINEAR_EXAMPLES[0]; text=this.selected.matrix.replace(/;/g,'\n'); t='1'; search='';category='Todos';page=0;
  view:'system'|'transform'='system'; matrix:Matrix=[];work:Matrix=[]; analysis!:Reduction; fit?:Reduction; inv:Matrix|null=null;
  det=''; spectral?:Spectrum; error='';notice=''; practice=false;reveal=false;step=0;
  history:{label:string;matrix:Matrix}[]=[]; operation='add';target=1;source=2;factor='-1';
  extent=5; yaw=0.65; pitch=0.45; perspective=1; blend=1;iterations=8;modulo=false;pattern='flower';grid=true;eigen=true;
  running=false; private frame=0;private last=0;private observer?:ResizeObserver;private drag?:{x:number;y:number};
  zoom=1;private pointers=new Map<number,{x:number;y:number}>();
  quadratic=false; private contourKey='';private contours:{level:number;segments:ContourSegment[]}[]=[];
  probeX=1;probeY=1;probeZ=1;
  get distances():{equation:number;distance:number;projection:number[]}[]{const p=[this.probeX,this.probeY,this.probeZ].slice(0,this.n);if(!p.every(Number.isFinite))return [];return this.matrix.flatMap((r,i)=>{const normal=r.slice(0,-1).map(q=>q.value),norm=Math.hypot(...normal);if(!norm)return [];const signed=(normal.reduce((s,v,j)=>s+v*p[j],0)-r[this.n].value)/norm;return [{equation:i+1,distance:Math.abs(signed),projection:p.map((v,j)=>v-signed*normal[j]/norm)}];});}
  get angles():{pair:string;angle:number;distance:number|null}[]{const result:{pair:string;angle:number;distance:number|null}[]=[];for(let i=0;i<this.matrix.length;i++)for(let j=i+1;j<this.matrix.length;j++){const a=this.matrix[i].slice(0,-1).map(q=>q.value),b=this.matrix[j].slice(0,-1).map(q=>q.value),na=Math.hypot(...a),nb=Math.hypot(...b);if(!na||!nb)continue;const dot=a.reduce((s,v,k)=>s+v*b[k],0)/(na*nb),cos=Math.min(1,Math.abs(dot));result.push({pair:`${i+1} / ${j+1}`,angle:Math.acos(cos)*180/Math.PI,distance:cos>1-1e-12?Math.abs(this.matrix[i][this.n].value/na-(dot<0?-1:1)*this.matrix[j][this.n].value/nb):null});}return result;}
  cases:{t:string;kind:string;rank:string}[]=[];scanMin=-3;scanMax=3;scanStep=0.25;scan: {t:string;kind:string;rank:string}[]=[];
  parameterStudy?:ParameterStudy; private studiedText='';
  readonly colors=['#61d8ff','#ff7ca8','#7bffc6','#ffcf70','#ad91ff','#ff9966'];
  constructor(private zone:NgZone,private changeDetector:ChangeDetectorRef) {this.apply();}
  get filtered():readonly LinearExample[]{const norm=(s:string)=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();const words=norm(this.search).split(/\s+/).filter(Boolean);return this.examples.filter(e=>(this.category==='Todos'||e.category===this.category)&&words.every(w=>norm(`${e.name} ${e.category} ${e.description} ${e.challenge}`).includes(w)));}
  get pages():number{return Math.max(1,Math.ceil(this.filtered.length/12));}
  get visible():readonly LinearExample[]{const p=Math.min(this.page,this.pages-1);return this.filtered.slice(p*12,p*12+12);}
  get n():number{return this.matrix[0]?.length-1||0;}
  get spatialGridStep():number{return niceStep(2*this.extent,16);}
  get parameterized():boolean{return /\bt\b/.test(this.text);}
  get currentStep():Matrix{return this.analysis.steps[Math.min(this.step,this.analysis.steps.length-1)].matrix;}
  get solution():string{return this.analysis.kind==='Incompatible'?'∅':`x = (${this.analysis.particular.join(', ')})${this.analysis.kernel.map((v,i)=>` + s${i+1} (${v.join(', ')})`).join('')}`;}
  get residual():string {if(!this.fit)return '';const x=this.fit.particular;return this.matrix.map(r=>r.slice(0,-1).reduce((s,q,j)=>s.add(q.mul(x[j])),new Q(0)).sub(r[this.n]).toString()).join(', ');}
  get dynamicQuery():Record<string,string>{const a=this.matrix;if(!this.spectral)return {};return {field:JSON.stringify({dx:`(${a[0][0]})*x+(${a[0][1]})*y`,dy:`(${a[1][0]})*x+(${a[1][1]})*y`,bounds:[-5,5,-5,5],parameters:[],duration:20,t:0,seeds:[{point:[1,1],t:0,color:'#61d8ff'}]})};}
  ngAfterViewInit():void {
    const state=new URLSearchParams(location.search).get('linear');if(state){try{const s=JSON.parse(state);if(typeof s.matrix!=='string'||s.matrix.length>7000||!['system','transform'].includes(s.view)||typeof s.t!=='string')throw Error('Enlace inválido.');this.text=s.matrix;this.t=s.t;this.view=s.view;this.selected={...this.selected,name:'Laboratorio compartido',description:'Configuración recuperada del enlace.',matrix:this.text,critical:[]};this.apply();}catch{this.error='No se pudo recuperar el enlace compartido.';}}
    this.observer=new ResizeObserver(()=>this.paint());this.observer.observe(this.canvas.nativeElement);this.paint();this.changeDetector.detectChanges();
  }
  ngOnDestroy():void{cancelAnimationFrame(this.frame);this.observer?.disconnect();}
  choose(e:LinearExample):void{this.selected=e;this.text=e.matrix.replace(/;/g,'\n');this.t=e.t;this.view=e.view;this.modulo=e.id.startsWith('cat');this.extent=this.modulo?1:5;this.blend=1;this.reveal=false;this.scan=[];this.apply();}
  apply():void {
    try{
      const matrix=parseMatrix(this.text,this.t),a=matrix.map(r=>r.slice(0,-1)),analysis=reduce(matrix);
      if(a.some(r=>r.some(q=>!Number.isFinite(q.value)||Math.abs(q.value)>1e8)))throw Error('Para visualizar, los coeficientes deben tener módulo ≤ 10⁸.');
      const square=a.length===a[0].length,det=square?determinant(a).toString():'No definido (matriz rectangular)',inv=square?inverse(a):null;
      const fit=leastSquares(matrix);
      this.matrix=matrix;this.work=clone(matrix);this.analysis=analysis;this.fit=fit;this.det=det;this.inv=inv;
      this.spectral=a.length===2&&a[0].length===2?spectrum(a.map(r=>r.map(q=>q.value))):undefined;
      this.history=[{label:'Matriz inicial',matrix:clone(matrix)}];this.step=0;this.target=1;this.source=Math.min(2,matrix.length);this.error='';
      if(this.text!==this.studiedText){this.parameterStudy=this.parameterized?studyParameter(this.text):undefined;this.studiedText=this.text;}
      const critical=[...(this.selected.matrix.replace(/;/g,'\n')===this.text?this.selected.critical:[]),...(this.parameterStudy?.roots.flatMap(r=>r.exact?[r.exact]:[])||[])];
      this.cases=[...new Set(critical)].map(t=>this.classify(t));
      this.paint();
    }catch(e){this.error=e instanceof Error?e.message:String(e);}
  }
  classify(t:string):{t:string;kind:string;rank:string}{try{const r=reduce(parseMatrix(this.text,t));return {t,kind:r.kind,rank:`${r.rank} / ${r.augmentedRank}`};}catch{return {t,kind:'No definido',rank:'—'};}}
  parameterInput(value:number):void{if(Number.isFinite(value)){this.t=value.toString();this.apply();}}
  get numericT():number{try{return expression(this.t,new Q(0)).value;}catch{return 0;}}
  scanParameters():void{
    if(![this.scanMin,this.scanMax,this.scanStep].every(Number.isFinite)||this.scanMin>=this.scanMax||this.scanStep<=0||(this.scanMax-this.scanMin)/this.scanStep>160){this.error='Barrido: intervalo ordenado, paso positivo y hasta 161 muestras.';return;}
    this.scan=Array.from({length:Math.floor((this.scanMax-this.scanMin)/this.scanStep)+1},(_,i)=>this.classify(Number((this.scanMin+i*this.scanStep).toPrecision(12)).toString()));this.error='';
  }
  rowOperation():void{
    try{const a=clone(this.work),i=+this.target-1,j=+this.source-1;
      if(!Number.isInteger(i)||!a[i]||!Number.isInteger(j)||!a[j])throw Error('Selecciona filas válidas.');
      const f=expression(this.factor,expression(this.t,new Q(0)));let label='';
      if(this.operation==='swap'){if(i===j)throw Error('Selecciona dos filas distintas.');[a[i],a[j]]=[a[j],a[i]];label=`F${i+1} ↔ F${j+1}`;}
      else if(this.operation==='scale'){if(f.zero)throw Error('Multiplicar por cero no es una operación reversible.');a[i]=a[i].map(q=>q.mul(f));label=`F${i+1} ← (${f}) F${i+1}`;}
      else {if(i===j)throw Error('La fila origen debe ser distinta.');a[i]=a[i].map((q,k)=>q.add(f.mul(a[j][k])));label=`F${i+1} ← F${i+1} + (${f}) F${j+1}`;}
      if(this.history.length>=150)throw Error('Hasta 150 operaciones; reinicia para continuar.');
      this.work=a;this.history.push({label,matrix:clone(a)});this.error='';
    }catch(e){this.error=(e as Error).message;}
  }
  undo():void{if(this.history.length>1){this.history.pop();this.work=clone(this.history[this.history.length-1].matrix);}}
  useStep():void{this.work=clone(this.currentStep);this.history.push({label:this.analysis.steps[this.step].label,matrix:clone(this.work)});}
  restart():void{this.work=clone(this.matrix);this.history=[{label:'Matriz inicial',matrix:clone(this.work)}];}
  hint():string{const r=reduce(this.work);return r.steps.length>1?`Siguiente operación posible: ${r.steps[1].label}`:'Ya no necesitas eliminar coeficientes. Interpreta pivotes y filas nulas.';}
  fmt(v:number):string{return Number.isFinite(v)?Number(v.toPrecision(5)).toString():'∞';}
  private cameraDepth(v:V):number{return (Math.sin(this.yaw)*v[0]+Math.cos(this.yaw)*v[1])*Math.cos(this.pitch)+(v[2]||0)*Math.sin(this.pitch);}
  private project(v:V,w:number,h:number):[number,number]{
    const [x,y,z=0]=v,c=Math.cos(this.yaw),s=Math.sin(this.yaw),u=c*x-s*y,depth=s*x+c*y;
    const distance=this.extent*3.5,denominator=distance-this.perspective*this.cameraDepth(v);
    // Points at or behind the camera cannot be projected onto its image plane.
    if(denominator<distance*0.05)return [NaN,NaN];
    // Fixed focal scale: rotating changes orientation, never the user's zoom.
    const scale=Math.min(w,h)/(this.extent*4.5)*this.zoom*distance/denominator;
    return [w/2+u*scale,h/2-(z*Math.cos(this.pitch)-depth*Math.sin(this.pitch))*scale];
  }
  paint():void{
    if(!this.canvas||!this.matrix.length)return;const c=this.canvas.nativeElement,rect=c.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);c.width=Math.max(320,rect.width)*dpr;c.height=c.width*0.67;
    const ctx=c.getContext('2d');if(!ctx)return;ctx.fillStyle='#070d17';ctx.fillRect(0,0,c.width,c.height);
    if(this.view==='transform'&&this.spectral)this.paintTransform(ctx,c.width,c.height);else if(this.n===2)this.paintLines(ctx,c.width,c.height);else if(this.n===3)this.paintPlanes(ctx,c.width,c.height);else{ctx.fillStyle='#c0cadc';ctx.font=`${14*dpr}px monospace`;ctx.fillText('Visualización geométrica disponible para 2 y 3 incógnitas.',20*dpr,c.height/2);}
  }
  private stroke(ctx:CanvasRenderingContext2D,points:V[],color:string,width=1,fill=false):void{
    if(!points.length||points.some(p=>!p.every(Number.isFinite)))return;ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.strokeStyle=color;ctx.lineWidth=width;if(fill){ctx.closePath();ctx.fillStyle=color;ctx.fill();}ctx.stroke();
  }
  private dot(ctx:CanvasRenderingContext2D,p:V,color:string):void{if(!p.every(Number.isFinite))return;ctx.beginPath();ctx.arc(p[0],p[1],5,0,2*Math.PI);ctx.fillStyle=color;ctx.fill();}
  private paintLines(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    const E=this.extent,map=(x:number,y:number):V=>[w/2+x*w/(2*E),h/2-y*w/(2*E)];
    if(this.grid)for(const x of axisTicks(-E,E,niceStep(2*E))){this.stroke(ctx,[map(x,-E),map(x,E)],'#1b2940');this.stroke(ctx,[map(-E,x),map(E,x)],'#1b2940');}
    this.stroke(ctx,[map(-E,0),map(E,0)],'#66748b');this.stroke(ctx,[map(0,-E),map(0,E)],'#66748b');
    this.matrix.forEach((r,i)=>{const [a,b,d]=r.map(q=>q.value);if(Math.abs(b)>Math.abs(a)&&b)this.stroke(ctx,[map(-E,(d+a*E)/b),map(E,(d-a*E)/b)],this.colors[i],2);else if(a)this.stroke(ctx,[map((d+b*E)/a,-E),map((d-b*E)/a,E)],this.colors[i],2);});
    if(!this.practice||this.reveal){if(this.analysis.kind==='Compatible determinado')this.dot(ctx,map(...this.analysis.particular.map(q=>q.value) as [number,number]),'#fff');if(this.fit&&this.analysis.kind==='Incompatible')this.dot(ctx,map(...this.fit.particular.map(q=>q.value) as [number,number]),'#ffcf70');}
  }
  private paintPlanes(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    const E=this.extent,project=(v:V)=>this.project(v,w,h),unit=(a:V)=>{const n=Math.hypot(...a);return a.map(x=>x/n);};
    const cube=cubeVertices(E);
    CUBE_EDGES.forEach(([i,j])=>this.stroke(ctx,[project(cube[i]),project(cube[j])],'#7085a080',1.2));
    if(this.grid){
      ctx.save();ctx.font=`${11*Math.min(devicePixelRatio||1,2)}px monospace`;ctx.fillStyle='#8797b0';
      for(const tick of axisTicks(-E,E,this.spatialGridStep)){
        this.stroke(ctx,[project([-E,tick,0]),project([E,tick,0])],'#1b2940');
        this.stroke(ctx,[project([tick,-E,0]),project([tick,E,0])],'#1b2940');
        if(tick===0)continue;
        for(const point of [[tick,0,0],[0,tick,0],[0,0,tick]]){
          const p=project(point);if(!p.every(Number.isFinite))continue;
          this.stroke(ctx,[[p[0]-3,p[1]],[p[0]+3,p[1]]],'#8797b0');
          ctx.fillText(this.fmt(tick),p[0]+5,p[1]+12);
        }
      }
      ctx.restore();
    }
    for(let i=0;i<3;i++){const a=[0,0,0],b=[0,0,0];a[i]=-E;b[i]=E;this.stroke(ctx,[project(a),project(b)],this.colors[i],1.5);ctx.fillStyle=this.colors[i];const p=project(b);if(p.every(Number.isFinite))ctx.fillText(['x','y','z'][i],p[0]+5,p[1]);}
    const planes=this.matrix.map((r,i)=>{const vertices=planeCubeSection(r.slice(0,3).map(q=>q.value),r[3].value,E);if(!vertices.length)return null;const center=[0,1,2].map(k=>vertices.reduce((sum,p)=>sum+p[k],0)/vertices.length);return {i,center,vertices};}).filter((p):p is NonNullable<typeof p>=>!!p).sort((a,b)=>this.cameraDepth(a.center)-this.cameraDepth(b.center));
    planes.forEach(p=>{if(p.vertices.length>=3)this.stroke(ctx,p.vertices.map(project),this.colors[p.i]+'30',1,true);this.stroke(ctx,[...p.vertices,p.vertices[0]].map(project),this.colors[p.i]+'bb',1.5);if(p.vertices.length===1)this.dot(ctx,project(p.vertices[0]),this.colors[p.i]);});
    // Clip each pairwise intersection to the same reference cube.
    // Exact row reduction also distinguishes parallel and coincident planes.
    ctx.save();
    const scale=Math.min(devicePixelRatio||1,2);
    ctx.setLineDash([8*scale,5*scale]);
    for(let i=0;i<planes.length;i++)for(let j=i+1;j<planes.length;j++){
      const first=planes[i],second=planes[j];
      const intersection=reduce([this.matrix[first.i],this.matrix[second.i]]);
      if(intersection.kind==='Incompatible'||intersection.kernel.length!==1)continue;
      const point=intersection.particular.map(q=>q.value),direction=unit(intersection.kernel[0].map(q=>q.value));
      const segment=lineCubeSegment(point,direction,E).map(project);
      if(segment.length!==2)continue;
      if(segment.some(p=>!p.every(Number.isFinite)))continue;
      this.stroke(ctx,segment,'#070d17',6*scale);
      const gradient=ctx.createLinearGradient(segment[0][0],segment[0][1],segment[1][0],segment[1][1]);
      gradient.addColorStop(0,this.colors[first.i]);gradient.addColorStop(1,this.colors[second.i]);
      ctx.beginPath();ctx.moveTo(segment[0][0],segment[0][1]);ctx.lineTo(segment[1][0],segment[1][1]);ctx.strokeStyle=gradient;ctx.lineWidth=2.5*scale;ctx.stroke();
    }
    ctx.restore();
    if(!this.practice||this.reveal){const r=this.analysis;if(r.kind!=='Incompatible'){const p=r.particular.map(q=>q.value);if(r.kernel.length===1){const v=unit(r.kernel[0].map(q=>q.value));ctx.save();ctx.setLineDash([8*scale,5*scale]);this.stroke(ctx,lineCubeSegment(p,v,E).map(project),'#fff',2*scale);ctx.restore();}if(p.every(x=>Math.abs(x)<=E))this.dot(ctx,project(p),'#fff');}}
  }
  private paintTransform(ctx:CanvasRenderingContext2D,w:number,h:number):void{
    const a=this.matrix.map(r=>r.slice(0,2).map(q=>q.value)),E=this.extent,map=(p:V):V=>this.modulo?[30+p[0]*(w-60),h-30-p[1]*(h-60)]:[w/2+p[0]*w/(2*E),h/2-p[1]*w/(2*E)],apply=(p:V):V=>[(1-this.blend)*p[0]+this.blend*(a[0][0]*p[0]+a[0][1]*p[1]),(1-this.blend)*p[1]+this.blend*(a[1][0]*p[0]+a[1][1]*p[1])];
    if(this.modulo){for(let i=0;i<1800;i++){const angle=i*2.399963,r=0.35*Math.sqrt(i/1800);let p:V=[0.5+r*Math.cos(angle),0.5+r*Math.sin(angle)];for(let k=0;k<this.iterations;k++){const q=[a[0][0]*p[0]+a[0][1]*p[1],a[1][0]*p[0]+a[1][1]*p[1]];p=q.map(v=>((v%1)+1)%1);}ctx.fillStyle=`hsl(${i*360/1800},85%,65%)`;const q=map(p);ctx.fillRect(q[0],q[1],2,2);}return;}
    if(this.grid)for(const x of axisTicks(-E,E,niceStep(2*E))){for(const line of [[[x,-E],[x,E]],[[-E,x],[E,x]]]){this.stroke(ctx,line.map(map),'#19273b');this.stroke(ctx,line.map(p=>map(apply(p))),'#24506b');}}
    if(this.quadratic){const key=JSON.stringify([a,E]);if(key!==this.contourKey){this.contourKey=key;this.contours=[-4,-1,1,4].map(level=>({level,segments:traceContours((x,y)=>a[0][0]*x*x+(a[0][1]+a[1][0])*x*y+a[1][1]*y*y-level,[-E,E,-E,E],90,70)}));}for(const contour of this.contours)for(const [p,q] of contour.segments)this.stroke(ctx,[map([p.x,p.y]),map([q.x,q.y])],contour.level<0?'#ff7ca880':'#ffcf7080',1.5);}
    const circle=Array.from({length:241},(_,i)=>[Math.cos(i*Math.PI/120),Math.sin(i*Math.PI/120)]);this.stroke(ctx,circle.map(map),'#66748b');this.stroke(ctx,circle.map(p=>map(apply(p))),'#7bffc6',2.5);
    const shape=Array.from({length:481},(_,i)=>{const t=i*Math.PI/240;const r=this.pattern==='flower'?1.6+0.65*Math.cos(7*t):this.pattern==='star'?(i%96<48?2:0.8):1;return [r*Math.cos(t),r*Math.sin(t)];});
    this.stroke(ctx,shape.map(map),'#ff7ca850');this.stroke(ctx,shape.map(p=>map(apply(p))),'#ff7ca8',2);
    this.stroke(ctx,[[0,0],[1,0],[1,1],[0,1],[0,0]].map(p=>map(apply(p))),'#ffcf70',2);
    for(let i=0;i<2;i++)this.stroke(ctx,[map([0,0]),map(apply(i?[0,1]:[1,0]))],this.colors[i],3);
    if(this.eigen&&this.spectral?.real)this.spectral.vectors.forEach(v=>this.stroke(ctx,[-E,E].map(k=>map(v.map(x=>x*k))),'#ad91ff88',2));
    for(let j=0;j<12;j++){let p:V=[Math.cos(j*Math.PI/6),Math.sin(j*Math.PI/6)];const path=[map(p)];for(let i=0;i<this.iterations;i++){p=[a[0][0]*p[0]+a[0][1]*p[1],a[1][0]*p[0]+a[1][1]*p[1]];if(Math.hypot(...p)>E*10)break;path.push(map(p));}this.stroke(ctx,path,this.colors[j%6]+'90',1);path.forEach(p=>this.dot(ctx,p,this.colors[j%6]));}
  }
  private pinchDistance():number{const [a,b]=[...this.pointers.values()];return a&&b?Math.hypot(a.x-b.x,a.y-b.y):0;}
  private changeZoom(factor:number):void{if(Number.isFinite(factor)&&factor>0){this.zoom=Math.max(0.2,Math.min(5,this.zoom*factor));this.paint();}}
  wheelZoom(e:WheelEvent):void{
    if(this.n!==3||this.view!=='system')return;
    e.preventDefault();const pixels=e.deltaY*(e.deltaMode===1?16:e.deltaMode===2?this.canvas.nativeElement.clientHeight:1);
    this.changeZoom(Math.exp(Math.max(-1,Math.min(1,-pixels*0.0015))));
  }
  startDrag(e:PointerEvent):void{
    if(this.n!==3||this.view!=='system'||(e.pointerType==='mouse'&&e.button!==0))return;
    this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});this.drag=this.pointers.size===1?{x:e.clientX,y:e.clientY}:undefined;
    this.canvas.nativeElement.setPointerCapture(e.pointerId);
  }
  moveDrag(e:PointerEvent):void{
    if(!this.pointers.has(e.pointerId))return;
    const before=this.pinchDistance();this.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
    if(this.pointers.size>=2){const after=this.pinchDistance();if(before>1&&after>1)this.changeZoom(after/before);this.drag=undefined;return;}
    if(this.drag){this.yaw-=(e.clientX-this.drag.x)*0.008;this.pitch=Math.max(-1.4,Math.min(1.4,this.pitch+(e.clientY-this.drag.y)*0.008));this.paint();}
    this.drag={x:e.clientX,y:e.clientY};
  }
  endDrag(e:PointerEvent):void{
    if(!this.pointers.delete(e.pointerId))return;
    this.drag=this.pointers.size===1?[...this.pointers.values()][0]:undefined;
  }
  animate():void{this.running=!this.running;cancelAnimationFrame(this.frame);if(!this.running)return;this.last=performance.now();this.zone.runOutsideAngular(()=>{const tick=(now:number)=>{if(!this.running)return;this.blend=(Math.sin((now-this.last)/1400-Math.PI/2)+1)/2;this.paint();this.frame=requestAnimationFrame(tick);};this.frame=requestAnimationFrame(tick);});}
  download(kind:'png'|'json'):void{const a=document.createElement('a');a.download=`laboratorio-lineal.${kind}`;const url=kind==='png'?this.canvas.nativeElement.toDataURL():URL.createObjectURL(new Blob([JSON.stringify({matrix:this.text,t:this.t,view:this.view,solution:this.solution,steps:this.analysis.steps.map(s=>({label:s.label,matrix:s.matrix.map(r=>r.map(q=>q.toString()))})),history:this.history.map(s=>({label:s.label,matrix:s.matrix.map(r=>r.map(q=>q.toString()))}))},null,2)],{type:'application/json'}));a.href=url;a.click();if(kind==='json')URL.revokeObjectURL(url);}
  async share():Promise<void>{const url=new URL(location.href);url.searchParams.set('linear',JSON.stringify({matrix:this.text,t:this.t,view:this.view}));try{await navigator.clipboard.writeText(url.href);this.notice='Enlace copiado.';}catch{this.notice=url.href;}}
  preview(e:LinearExample):string{
    try{const a=parseMatrix(e.matrix,e.t),points=Array.from({length:65},(_,i)=>{const angle=i*Math.PI/32,r=28+10*Math.cos(5*angle),x=r*Math.cos(angle),y=r*Math.sin(angle);if(e.view==='transform')return [80+(a[0][0].value*x+a[0][1].value*y)*0.7,50-(a[1][0].value*x+a[1][1].value*y)*0.7].join(',');return [80+x,50+y].join(',');}).join(' ');return points;}catch{return '';}
  }
  systemPreview(e:LinearExample):string[]{try{const a=parseMatrix(e.matrix,e.t);if(a[0].length===3)return a.map(r=>{const [x,y,b]=r.map(q=>q.value);return Math.abs(y)>Math.abs(x)?`0,${50-12*(b+6*x)/y} 160,${50-12*(b-6*x)/y}`:x?`${80+12*(b+4*y)/x},100 ${80+12*(b-4*y)/x},0`:'';});return a.map((r,i)=>{const d=r[r.length-1].value;return `${20+i*13},${68+d*2} ${70+i*13},${18+d*2} ${135-i*9},${42+d*2} ${85-i*9},${92+d*2} ${20+i*13},${68+d*2}`;});}catch{return [];}}
}
