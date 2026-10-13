import { ExtendedComplex, MandelbrotView, SavedView, extendedAdd as add, extendedMultiply as mul, extendedFromFixed, extendedLog as logAbs, extendedNumber, normalize, pointAt, restoreView, spanFixed } from './mandelbrot-view';
export interface RenderSettings { view: SavedView; width: number; height: number; iterations: number; antialias: 'none' | 'adaptive' | 'full'; }
export interface ReferenceOrbit { real: Float64Array; imag: Float64Array; exponent: Float64Array; center: SavedView; interior: boolean; }
export interface RenderTile { x: number; y: number; width: number; height: number; }
export interface TileResult extends RenderTile { samples: Float32Array; evaluated: number; skipped: number; repaired: number; }
interface BLA { a: ExtendedComplex; b: ExtendedComplex; radius: number; start: number; length: number; safe: boolean; }
const ZERO: ExtendedComplex = { r: 0, i: 0, e: 0 };
const ONE: ExtendedComplex = { r: 1, i: 0, e: 0 };
const TWO: ExtendedComplex = { r: 1, i: 0, e: 1 };
const BLA_EPSILON_LOG = -50;
const GLITCH_LOG = -12;
const BAILOUT_SQUARED = 256;
function smoothEscape(n: number, log2Norm: number): number { return Math.max(0, n + 1 - Math.log2(log2Norm * Math.LN2)); }
/** Conservative interval bounds prove a whole viewport lies in the cardioid or period-2 bulb. */
export function interiorViewport(view: MandelbrotView, width: number, height: number): boolean {
  type Interval = [bigint, bigint];
  const unit = 1n << BigInt(view.bits), radiusX = spanFixed(view) / 2n;
  const radiusY = radiusX * BigInt(height) / BigInt(width) + 1n;
  const sum = (a: Interval,b: Interval): Interval => [a[0]+b[0],a[1]+b[1]];
  const square = (a: Interval): Interval => {
    const lo = a[0] <= 0n && a[1] >= 0n ? 0n : (a[0]*a[0] < a[1]*a[1] ? a[0]*a[0] : a[1]*a[1]);
    const hi = a[0]*a[0] > a[1]*a[1] ? a[0]*a[0] : a[1]*a[1];
    return [lo >> BigInt(view.bits), (hi >> BigInt(view.bits)) + 1n];
  };
  const product = (a: Interval,b: Interval): Interval => {
    const values=[a[0]*b[0],a[0]*b[1],a[1]*b[0],a[1]*b[1]];
    const lo=values.reduce((x,y)=>x<y?x:y), hi=values.reduce((x,y)=>x>y?x:y);
    return [lo >> BigInt(view.bits),(hi >> BigInt(view.bits))+1n];
  };
  const x: Interval=[view.real-radiusX,view.real+radiusX], y: Interval=[view.imag-radiusY,view.imag+radiusY];
  const y2=square(y), bulb=sum(square([x[0]+unit,x[1]+unit]),y2);
  if(bulb[1] < unit/16n) return true;
  const u: Interval=[x[0]-unit/4n,x[1]-unit/4n], q=sum(square(u),y2);
  return product(q,sum(q,u))[1] < y2[0]/4n;
}
export function createReference(settings: RenderSettings): ReferenceOrbit | null {
  const view=restoreView(settings.view);
  if(view.zoom < 28) return null;
  const interior=interiorViewport(view,settings.width,settings.height);
  if(interior) return { real:new Float64Array(1), imag:new Float64Array(1), exponent:new Float64Array(1), center:settings.view, interior:true };
  const real=new Float64Array(settings.iterations+1), imag=new Float64Array(settings.iterations+1), exponent=new Float64Array(settings.iterations+1);
  const shift=BigInt(view.bits), bailout=(1n<<shift)*256n;
  let r=0n,i=0n,count=1;
  for(let n=1;n<=settings.iterations;n++) {
    const next=((r*r-i*i)>>shift)+view.real;
    i=((2n*r*i)>>shift)+view.imag;r=next;
    const z=extendedFromFixed(r,i,view.bits);real[n]=z.r;imag[n]=z.i;exponent[n]=z.e;count=n+1;
    if(((r*r+i*i)>>shift)>bailout) break;
  }
  return {real:real.slice(0,count),imag:imag.slice(0,count),exponent:exponent.slice(0,count),center:settings.view,interior:false};
}
function directEscape(real: number,imag: number,maximum: number): number {
  const u=real-.25,q=u*u+imag*imag;
  if(q*(q+u)<.25*imag*imag-1e-15 || (real+1)**2+imag*imag<.0625-1e-15) return -1;
  let r=0,i=0,checkpointR=0,checkpointI=0,power=1,length=0;
  for(let n=1;n<=maximum;n++) {
    const next=r*r-i*i+real;i=2*r*i+imag;r=next;
    const norm=r*r+i*i;
    if(norm>BAILOUT_SQUARED) return smoothEscape(n,Math.log2(norm)/2);
    // Brent checkpoints: identical binary64 states have identical future iterations.
    // Deliberately NOT applied to deep perturbation, where hidden deltas still matter.
    if(r===checkpointR&&i===checkpointI)return -1;
    if(++length===power){checkpointR=r;checkpointI=i;power*=2;length=0;}
  }
  return -1;
}
/** Correct suspicious pixels with full precision rather than hiding perturbation glitches. */
export function exactEscape(real: bigint,imag: bigint,bits: number,maximum: number): number {
  let r=0n,i=0n;const shift=BigInt(bits), bailout=(1n<<shift)*BigInt(BAILOUT_SQUARED);
  for(let n=1;n<=maximum;n++) {
    const next=((r*r-i*i)>>shift)+real;i=((2n*r*i)>>shift)+imag;r=next;
    if(((r*r+i*i)>>shift)>bailout) return smoothEscape(n,logAbs(extendedFromFixed(r,i,bits)));
  }
  return -1;
}
export class MandelbrotEngine {
  readonly view: MandelbrotView;
  readonly mode: 'direct' | 'perturbation' | 'extended';
  private referenceView: MandelbrotView;
  private levels: BLA[][]=[];
  private span: ExtendedComplex;
  private offset: ExtendedComplex;
  private doubleReal: Float64Array;
  private doubleImag: Float64Array;
  private centerR=0;private centerI=0;private spanNumber=0;
  evaluated=0;skipped=0;repaired=0;
  constructor(readonly settings: RenderSettings, private reference: ReferenceOrbit | null) {
    this.view=restoreView(settings.view);this.referenceView=reference?restoreView(reference.center):this.view;
    this.mode=!reference?'direct':this.view.zoom>900?'extended':'perturbation';
    this.span=extendedFromFixed(spanFixed(this.view),0n,this.view.bits);
    [this.centerR,this.centerI]=extendedNumber(extendedFromFixed(this.view.real,this.view.imag,this.view.bits));this.spanNumber=extendedNumber(this.span)[0];
    this.offset=extendedFromFixed(this.view.real-this.referenceView.real,this.view.imag-this.referenceView.imag,this.view.bits);
    this.doubleReal=new Float64Array(reference?.real.length||0);this.doubleImag=new Float64Array(reference?.real.length||0);
    if(reference&&!reference.interior) {
      for(let n=0;n<reference.real.length;n++) {
        this.doubleReal[n]=reference.real[n]*2**reference.exponent[n];this.doubleImag[n]=reference.imag[n]*2**reference.exponent[n];
      }
      this.buildBLA();
    }
  }
  private z(index: number): ExtendedComplex { return {r:this.reference!.real[index],i:this.reference!.imag[index],e:this.reference!.exponent[index]}; }
  private buildBLA(): void {
    const reference=this.reference!, bound=Math.hypot(1+2/this.settings.width,(this.settings.height+2)/this.settings.width)/2;
    const cMax=logAbs(add(mul(this.span,{r:bound,i:0,e:0}),normalize(Math.hypot(this.offset.r,this.offset.i),0,this.offset.e)))+.01;
    const leaves: BLA[]=[];
    for(let n=1;n<reference.real.length-1;n++) {
      const a=mul(TWO,this.z(n));
      leaves.push({a,b:ONE,radius:logAbs(a)+BLA_EPSILON_LOG,start:n,length:1,safe:logAbs(this.z(n))<2&&logAbs(this.z(n+1))<2});
    }
    this.levels=[leaves];
    while(this.levels[this.levels.length-1].length>1) {
      const previous=this.levels[this.levels.length-1], next: BLA[]=[];
      for(let i=0;i<previous.length;i+=2) {
        const x=previous[i],y=previous[i+1];if(!y){next.push(x);continue;}
        const subtraction=logAbs(x.b)+cMax-y.radius;
        const radius=subtraction>=0?-Infinity:Math.min(x.radius,y.radius+Math.log2(1-2**subtraction)-logAbs(x.a));
        next.push({a:mul(y.a,x.a),b:add(mul(y.a,x.b),y.b),radius,start:x.start,length:x.length+y.length,safe:x.safe&&y.safe});
      }
      this.levels.push(next);
    }
  }
  private lookup(m: number,deltaLog: number,n: number,double: boolean): BLA | undefined {
    for(let level=this.levels.length-1;level>=0;level--) {
      const length=2**level;if((m-1)%length)continue;
      const node=this.levels[level][Math.floor((m-1)/length)];
      if(node&&node.start===m&&node.safe&&n+node.length<=this.settings.iterations&&deltaLog<node.radius&&(!double||(node.a.e<900&&node.b.e<900))) return node;
    }
    return undefined;
  }
  sample(px: number,py: number): number {
    this.evaluated++;
    if(this.reference?.interior) return -1;
    const x=(px-this.settings.width/2)/this.settings.width,y=(this.settings.height/2-py)/this.settings.width;
    if(this.mode==='direct') {
      return directEscape(this.centerR+this.spanNumber*x,this.centerI+this.spanNumber*y,this.settings.iterations);
    }
    const dc=add(this.offset,mul(this.span,{r:x,i:y,e:0}));
    const value=this.mode==='extended'?this.extendedOrbit(dc):this.doubleOrbit(dc);
    if(value!==null) return value;
    this.repaired++;
    const [real,imag]=pointAt(this.view,px,py,this.settings.width,this.settings.height);
    return exactEscape(real,imag,this.view.bits,this.settings.iterations);
  }
  private doubleOrbit(dc: ExtendedComplex): number | null {
    const [cr,ci]=extendedNumber(dc);let r=0,i=0,n=0,m=0;
    const maximum=this.settings.iterations,last=this.doubleReal.length-1;
    while(n<maximum) {
      const node=m>0?this.lookup(m,Math.log2(Math.hypot(r,i)),n,true):undefined;
      if(node) {
        const [ar,ai]=extendedNumber(node.a),[br,bi]=extendedNumber(node.b);
        const next=ar*r-ai*i+br*cr-bi*ci;i=ar*i+ai*r+br*ci+bi*cr;r=next;
        n+=node.length;m+=node.length;this.skipped+=node.length;
      } else {
        const zr=this.doubleReal[m],zi=this.doubleImag[m],next=2*(zr*r-zi*i)+r*r-i*i+cr;
        i=2*(zr*i+zi*r+r*i)+ci;r=next;n++;m++;
      }
      const zr=this.doubleReal[m],zi=this.doubleImag[m],real=zr+r,imag=zi+i,norm=real*real+imag*imag,refNorm=zr*zr+zi*zi;
      if(!Number.isFinite(norm)) return null;
      if(norm>BAILOUT_SQUARED) return smoothEscape(n,Math.log2(norm)/2);
      if(refNorm&&norm<refNorm*2**(2*GLITCH_LOG)) return null;
      if(norm<r*r+i*i||m===last) {r=real;i=imag;m=0;}
    }
    return -1;
  }
  private extendedOrbit(dc: ExtendedComplex): number | null {
    let delta=ZERO,n=0,m=0;const last=this.reference!.real.length-1;
    while(n<this.settings.iterations) {
      const node=m>0?this.lookup(m,logAbs(delta),n,false):undefined;
      if(node) {delta=add(mul(node.a,delta),mul(node.b,dc));n+=node.length;m+=node.length;this.skipped+=node.length;}
      else {delta=add(add(mul(mul(TWO,this.z(m)),delta),mul(delta,delta)),dc);m++;n++;}
      const z=this.z(m), actual=add(z,delta), norm=logAbs(actual), refNorm=logAbs(z);
      if(norm>4) return smoothEscape(n,norm);
      if(norm<refNorm+GLITCH_LOG&&refNorm!==-Infinity) return null;
      if(norm<logAbs(delta)||m===last) {delta=actual;m=0;}
    }
    return -1;
  }
  renderTile(tile: RenderTile): TileResult {
    const before=[this.evaluated,this.skipped,this.repaired], samples=new Float32Array(tile.width*tile.height*4);
    const centers=new Float64Array((tile.width+2)*(tile.height+2));
    const stride=tile.width+2;
    for(let y=0;y<tile.height+2;y++) for(let x=0;x<tile.width+2;x++) centers[y*stride+x]=this.sample(tile.x+x-.5,tile.y+y-.5);
    const different=(a: number,b: number) => (a<0)!==(b<0)||Math.abs(a-b)>.8;
    for(let y=0;y<tile.height;y++) for(let x=0;x<tile.width;x++) {
      const index=(y+1)*stride+x+1,value=centers[index],out=4*(y*tile.width+x);
      const edge=different(value,centers[index-1])||different(value,centers[index+1])||different(value,centers[index-stride])||different(value,centers[index+stride]);
      if(this.settings.antialias==='full'||this.settings.antialias==='adaptive'&&edge) {
        let k=0;for(const dy of [.25,.75])for(const dx of [.25,.75])samples[out+k++]=this.sample(tile.x+x+dx,tile.y+y+dy);
      } else samples.fill(value,out,out+4);
    }
    return {...tile,samples,evaluated:this.evaluated-before[0],skipped:this.skipped-before[1],repaired:this.repaired-before[2]};
  }
}
