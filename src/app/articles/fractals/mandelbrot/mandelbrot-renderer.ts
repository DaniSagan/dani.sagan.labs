import { createReference, MandelbrotEngine, ReferenceOrbit, RenderSettings, RenderTile, TileResult } from './mandelbrot-engine';
export interface MandelbrotField { samples: Float32Array; width: number; height: number; evaluated: number; skipped: number; repaired: number; workers: number; }
export interface RenderProgress { completed: number; total: number; tile?: TileResult; field: MandelbrotField; }
interface WorkerResponse { kind: 'reference' | 'ready' | 'tile' | 'error'; generation: number; reference?: ReferenceOrbit | null; result?: TileResult; message?: string; }
export class MandelbrotRenderer {
  private workers: Worker[]=[];
  private generation=0;
  private settle?: (result: MandelbrotField | null)=>void;
  private disposed=false;
  cancel(): void {this.generation++;this.workers.forEach(w=>w.terminate());this.workers=[];this.settle?.(null);this.settle=undefined;}
  destroy(): void {this.disposed=true;this.cancel();}
  async render(settings: RenderSettings,progress: (state: RenderProgress)=>void): Promise<MandelbrotField | null> {
    this.cancel();if(this.disposed)return null;
    const generation=this.generation;
    const count=typeof Worker==='undefined'?0:Math.min(8,Math.max(1,(navigator.hardwareConcurrency||4)-1));
    const field: MandelbrotField={samples:new Float32Array(settings.width*settings.height*4),width:settings.width,height:settings.height,evaluated:0,skipped:0,repaired:0,workers:Math.max(1,count)};
    field.samples.fill(NaN);
    const tiles: RenderTile[]=[];
    for(let y=0;y<settings.height;y+=24)for(let x=0;x<settings.width;x+=64)tiles.push({x,y,width:Math.min(64,settings.width-x),height:Math.min(24,settings.height-y)});
    tiles.sort((a,b)=>Math.hypot(a.x-settings.width/2,a.y-settings.height/2)-Math.hypot(b.x-settings.width/2,b.y-settings.height/2));
    const total=tiles.length;let completed=0;
    const accept=(tile: TileResult) => {
      for(let y=0;y<tile.height;y++)field.samples.set(tile.samples.subarray(y*tile.width*4,(y+1)*tile.width*4),((tile.y+y)*field.width+tile.x)*4);
      field.evaluated+=tile.evaluated;field.skipped+=tile.skipped;field.repaired+=tile.repaired;
      progress({completed:++completed,total,tile,field});
    };
    progress({completed:0,total,field});
    if(!count) {
      const engine=new MandelbrotEngine(settings,createReference(settings));
      for(const tile of tiles) {
        await new Promise<void>(resolve=>setTimeout(resolve,0));
        if(generation!==this.generation)return null;
        accept(engine.renderTile(tile));
      }
      return field;
    }
    return new Promise<MandelbrotField | null>((resolve,reject)=>{
      this.settle=resolve;
      const assign=(worker: Worker) => {
        const tile=tiles.shift();if(tile)worker.postMessage({kind:'tile',generation,settings,tile});
      };
      const finish=()=>{this.workers.forEach(w=>w.terminate());this.workers=[];this.settle=undefined;resolve(field);};
      const fail=(message: string)=>{if(generation!==this.generation)return;this.settle=undefined;this.cancel();reject(new Error(message));};
      try {
        for(let i=0;i<count;i++) {
          const worker=new Worker(new URL('./mandelbrot.worker',import.meta.url),{type:'module'});
          worker.onerror=event=>fail(event.message||'No se pudo iniciar el motor de cálculo.');
          worker.onmessage=(event: MessageEvent<WorkerResponse>)=>{
            const response=event.data;if(generation!==this.generation||response.generation!==generation)return;
            if(response.kind==='reference')this.workers.forEach(w=>w.postMessage({kind:'initialize',generation,settings,reference:response.reference}));
            else if(response.kind==='ready')assign(worker);
            else if(response.kind==='error')fail(response.message||'Error al calcular esta vista.');
            else if(response.result){accept(response.result);if(completed===total)finish();else assign(worker);}
          };
          this.workers.push(worker);
        }
        this.workers[0].postMessage({kind:'prepare',generation,settings});
      } catch(error) {fail(error instanceof Error?error.message:String(error));}
    });
  }
}
