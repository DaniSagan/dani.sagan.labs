export interface MandelbrotPalette { id: string; name: string; stops: string[]; interior: string; }
export const MANDELBROT_PALETTES: readonly MandelbrotPalette[] = [
  {id:'labs',name:'DaniSagan · coral y oro',stops:['#080c1c','#233e70','#4a9eff','#e8643a','#d4a843','#e8e4d8','#080c1c'],interior:'#08080e'},
  {id:'aurora',name:'Aurora',stops:['#111229','#4b297c','#ae77e4','#71e2ce','#eef9d2','#111229'],interior:'#0a0914'},
  {id:'fire',name:'Fuego',stops:['#130b15','#71182b','#e54b27','#ffbe54','#fff5da','#130b15'],interior:'#08070c'},
  {id:'ocean',name:'Océano',stops:['#020b24','#143f8e','#2586c5','#6bdad5','#eefaff','#020b24'],interior:'#04080f'},
  {id:'emerald',name:'Esmeralda',stops:['#160e35','#35468c','#287d8d','#56b870','#d6e962','#160e35'],interior:'#090c10'},
  {id:'mono',name:'Grafito',stops:['#080a10','#647087','#e8e4d8','#647087','#080a10'],interior:'#050608'}
];
const SIZE=2048;
const rgb=(hex: string) => [1,3,5].map(offset=>parseInt(hex.slice(offset,offset+2),16)/255);
const gamma=new Uint8ClampedArray(4096);
for(let n=0;n<gamma.length;n++)gamma[n]=Math.round(255*(n/4095)**(1/2.2));
/** Cache the escape field. Palette and phase changes require no orbit recalculation. */
export class MandelbrotColorizer {
  private lut=new Float32Array(SIZE*3);
  private interior: number[]=[];
  constructor(readonly palette: string,readonly phase: number,readonly period=32) {
    const definition=MANDELBROT_PALETTES.find(p=>p.id===palette)||MANDELBROT_PALETTES[0];
    const stops=definition.stops.map(rgb);this.interior=rgb(definition.interior).map(c=>c**2.2);
    for(let k=0;k<SIZE;k++) {
      const t=k/SIZE*(stops.length-1),i=Math.floor(t),f=t-i;
      for(let c=0;c<3;c++)this.lut[k*3+c]=(stops[i][c]+f*(stops[i+1][c]-stops[i][c]))**2.2;
    }
  }
  paint(samples: Float32Array): Uint8ClampedArray {
    const output=new Uint8ClampedArray(samples.length);
    for(let pixel=0;pixel<samples.length;pixel+=4) {
      if(!Number.isFinite(samples[pixel]))continue;
      let r=0,g=0,b=0;
      for(let sample=0;sample<4;sample++) {
        const value=samples[pixel+sample];
        if(value<0){r+=this.interior[0];g+=this.interior[1];b+=this.interior[2];}
        else {
          const t=((value/this.period+this.phase)%1+1)%1*SIZE,index=Math.floor(t),next=(index+1)%SIZE,f=t-index;
          r+=this.lut[index*3]+f*(this.lut[next*3]-this.lut[index*3]);
          g+=this.lut[index*3+1]+f*(this.lut[next*3+1]-this.lut[index*3+1]);
          b+=this.lut[index*3+2]+f*(this.lut[next*3+2]-this.lut[index*3+2]);
        }
      }
      output[pixel]=gamma[Math.min(4095,Math.round(r*.25*4095))];
      output[pixel+1]=gamma[Math.min(4095,Math.round(g*.25*4095))];
      output[pixel+2]=gamma[Math.min(4095,Math.round(b*.25*4095))];output[pixel+3]=255;
    }
    return output;
  }
}
