import { createReference, MandelbrotEngine, ReferenceOrbit, RenderSettings, RenderTile, TileResult } from './mandelbrot-engine';
interface WorkerRequest { kind: 'prepare' | 'initialize' | 'tile'; generation: number; settings: RenderSettings; reference?: ReferenceOrbit | null; tile?: RenderTile; }
const scope=globalThis as unknown as {onmessage: ((event: MessageEvent<WorkerRequest>)=>void)|null;postMessage: (message: unknown,transfer?: Transferable[])=>void};
let engine: MandelbrotEngine | undefined;
scope.onmessage=event=>{
  const request=event.data;
  try {
    if(request.kind==='prepare') {
      const reference=createReference(request.settings);
      scope.postMessage({kind:'reference',generation:request.generation,reference});
    } else if(request.kind==='initialize') {
      engine=new MandelbrotEngine(request.settings,request.reference||null);
      scope.postMessage({kind:'ready',generation:request.generation});
    } else if(engine&&request.tile) {
      const result: TileResult=engine.renderTile(request.tile);
      scope.postMessage({kind:'tile',generation:request.generation,result},[result.samples.buffer]);
    }
  } catch(error) { scope.postMessage({kind:'error',generation:request.generation,message:error instanceof Error?error.message:String(error)}); }
};
