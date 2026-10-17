export type Point2 = readonly [number, number];
export type Vector3 = readonly [number, number, number];
export const dot3 = (a: Vector3, b: Vector3): number => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
export const cross3 = (a: Vector3, b: Vector3): Vector3 => [a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
export const norm3 = (v: Vector3): number => Math.hypot(...v);
export const deg = (angle: number): number => angle*Math.PI/180;
export const format = (n: number): string => n.toLocaleString('es-ES',{maximumFractionDigits:3});
export const polar = (angle: number, radius=100, x=200, y=160): Point2 => [x+radius*Math.cos(deg(angle)),y-radius*Math.sin(deg(angle))];
export const points = (p: readonly Point2[]): string => p.map(v=>v.join(',')).join(' ');
export const regularPoints = (n: number, radius=110, rotation=-90): Point2[] => Array.from({length:n},(_,i)=>polar(rotation+360*i/n,radius));
export function arc(angle: number, radius=60, x=200, y=160): string {
  if (Math.abs(angle) >= 359.999) return `M ${x+radius} ${y} A ${radius} ${radius} 0 1 0 ${x-radius} ${y} A ${radius} ${radius} 0 1 0 ${x+radius} ${y}`;
  const end=polar(angle,radius,x,y);
  return `M ${x+radius} ${y} A ${radius} ${radius} 0 ${Math.abs(angle)>180?1:0} ${angle>=0?0:1} ${end[0]} ${end[1]}`;
}
/** A fixed oblique projection, never used to infer actual lengths or angles. */
export const project = (v: Vector3): Point2 => [190+26*(v[0]-0.6*v[1]),160-26*(v[2]+0.35*v[1])];
export function convexHull2(points: readonly Point2[]): Point2[] {
  const ordered=[...points].sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const turn=(a:Point2,b:Point2,c:Point2)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const half=(p:Point2[])=>{const hull:Point2[]=[];for(const v of p){while(hull.length>1&&turn(hull[hull.length-2],hull[hull.length-1],v)<=0)hull.pop();hull.push(v);}return hull;};
  if(ordered.length<3)return ordered;
  const lower=half(ordered),upper=half([...ordered].reverse());lower.pop();upper.pop();return [...lower,...upper];
}
