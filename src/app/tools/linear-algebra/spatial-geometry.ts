export type Vec3=[number,number,number];
export const CUBE_EDGES:[number,number][]=[];
for(let i=0;i<8;i++)for(let axis=0;axis<3;axis++){const j=i^(1<<axis);if(i<j)CUBE_EDGES.push([i,j]);}
export function cubeVertices(extent:number):Vec3[]{return Array.from({length:8},(_,i)=>[i&1?extent:-extent,i&2?extent:-extent,i&4?extent:-extent]);}
const dot=(a:number[],b:number[]):number=>a.reduce((sum,x,i)=>sum+x*b[i],0);
const cross=(a:number[],b:number[]):Vec3=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
/** Convex section of [-extent, extent]^3 by n·x = constant, in cyclic order. */
export function planeCubeSection(normal:number[],constant:number,extent:number):Vec3[]{
  const length=Math.hypot(...normal);if(!length)return [];
  const n=normal.map(x=>x/length),d=constant/length,vertices=cubeVertices(extent),points:Vec3[]=[],epsilon=extent*1e-9;
  const add=(p:Vec3):void=>{if(!points.some(q=>Math.hypot(...p.map((x,i)=>x-q[i]))<=epsilon))points.push(p);};
  for(const [i,j] of CUBE_EDGES){const a=vertices[i],b=vertices[j],fa=dot(n,a)-d,fb=dot(n,b)-d;
    if(Math.abs(fa)<=epsilon)add(a);if(Math.abs(fb)<=epsilon)add(b);
    if((fa<0)!==(fb<0)&&Math.abs(fa)>epsilon&&Math.abs(fb)>epsilon){const t=fa/(fa-fb);add(a.map((x,k)=>x+t*(b[k]-x)) as Vec3);}
  }
  if(points.length<3)return points;
  const center=points[0].map((_,k)=>points.reduce((sum,p)=>sum+p[k],0)/points.length),u=cross(n,Math.abs(n[2])<0.8?[0,0,1]:[0,1,0]),v=cross(n,u);
  return points.sort((a,b)=>{const offset=(p:Vec3)=>p.map((x,k)=>x-center[k]);return Math.atan2(dot(offset(a),v),dot(offset(a),u))-Math.atan2(dot(offset(b),v),dot(offset(b),u));});
}
/** Slab clipping of an infinite line, including tangencies. */
export function lineCubeSegment(point:number[],direction:number[],extent:number):Vec3[] {
  let lo=-Infinity,hi=Infinity;
  for(let k=0;k<3;k++){
    if(Math.abs(direction[k])<1e-12){if(Math.abs(point[k])>extent+extent*1e-9)return [];continue;}
    const a=(-extent-point[k])/direction[k],b=(extent-point[k])/direction[k];lo=Math.max(lo,Math.min(a,b));hi=Math.min(hi,Math.max(a,b));
  }
  if(lo>hi||![lo,hi].every(Number.isFinite))return [];
  return [lo,hi].map(t=>point.map((x,k)=>x+t*direction[k]) as Vec3);
}
