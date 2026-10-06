import { EXTRA_CONSTANTS, EXTRA_FUNCTIONS } from '../implicit-curve-graph-tool/math-catalog';
import { detectCurveParameters } from '../implicit-curve-graph-tool/curve-parameters';

export type Point = [number, number];
export type Bounds = [number, number, number, number];
export type Field = (x: number, y: number, t: number) => Point;
const bindings: Record<string, unknown> = {
  ...Object.fromEntries(Object.getOwnPropertyNames(Math).map(k => [k, Math[k as keyof Math]])),
  ...Object.fromEntries(EXTRA_FUNCTIONS.map(e => [e.name, e.fn])),
  ...Object.fromEntries(EXTRA_CONSTANTS.map(e => [e.name, e.value]))
};
export const reservedNames = new Set(['x','y','t',...Object.keys(bindings)]);
export function parameterNames(dx: string, dy: string): string[] {
  return detectCurveParameters(`${dx}\n${dy}`, reservedNames);
}
export function compileField(dx: string, dy: string, parameters: Record<string, number>): Field {
  const context = { ...bindings, ...parameters };
  // Shared links are untrusted input. Restrict compilation to numerical expressions:
  // no property access, strings, assignment, statements or access to browser globals.
  for (const expression of [dx,dy]) {
    if (expression.length > 2000) throw Error('Cada ecuación admite hasta 2000 caracteres.');
    const compact = expression.replace(/\s/g,'');
    const tokens = compact.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[\p{L}_$][\p{L}\p{M}\p{N}_$]*|\*\*|===|!==|<=|>=|==|!=|&&|\|\||[+\-*/%(),?:<>!]/gu) ?? [];
    if (tokens.join('') !== compact || tokens.some(token => /^[\p{L}_$]/u.test(token) &&
      !['x','y','t'].includes(token) && !Object.prototype.hasOwnProperty.call(context,token))) {
      throw Error('Usa expresiones numéricas con x, y, t, parámetros y funciones del catálogo.');
    }
  }
  const fn = new Function(...Object.keys(context), `"use strict"; return (x,y,t)=>[(${dx}),(${dy})];`)(...Object.values(context)) as Field;
  const sample = fn(0.37,0.61,0);
  if (sample.length !== 2 || sample.some(v => typeof v !== 'number')) throw Error('Las ecuaciones deben devolver números.');
  return fn;
}

// Dormand–Prince 5(4), embedded error estimate and bounded step rejection.
const A = [[],[1/5],[3/40,9/40],[44/45,-56/15,32/9],
  [19372/6561,-25360/2187,64448/6561,-212/729],
  [9017/3168,-355/33,46732/5247,49/176,-5103/18656],
  [35/384,0,500/1113,125/192,-2187/6784,11/84]];
const C = [0,1/5,3/10,4/5,8/9,1,1];
const B = [35/384,0,500/1113,125/192,-2187/6784,11/84,0];
const E = B.map((v,i) => v - [5179/57600,0,7571/16695,393/640,-92097/339200,187/2100,1/40][i]);
export interface Step { point: Point; t: number; next: number; }
export function adaptiveStep(field: Field, point: Point, t: number, h: number, tolerance = 1e-6): Step | null {
  if (![...point,t,h,tolerance].every(Number.isFinite) || h === 0 || tolerance <= 0) return null;
  for (let attempt = 0; attempt < 14; attempt++) {
    const k: Point[] = [];
    for (let i = 0; i < 7; i++) {
      const p: Point = [...point];
      for (let j = 0; j < i; j++) {
        p[0] += h*A[i][j]*k[j][0]; p[1] += h*A[i][j]*k[j][1];
      }
      const v = field(p[0],p[1],t+C[i]*h);
      if (!v.every(Number.isFinite)) return null;
      k.push(v);
    }
    const next: Point = [...point];
    let error = 0;
    for (let d = 0; d < 2; d++) {
      next[d] += h*k.reduce((sum,v,i) => sum+B[i]*v[d],0);
      error = Math.max(error,Math.abs(h*k.reduce((sum,v,i) => sum+E[i]*v[d],0)) /
        (tolerance*(1+Math.max(Math.abs(point[d]),Math.abs(next[d])))));
    }
    const factor = error ? Math.min(4,Math.max(0.15,0.9*error**(-0.2))) : 4;
    if (error <= 1 && next.every(Number.isFinite)) return { point: next, t: t+h, next: Math.sign(h)*Math.min(0.15,Math.abs(h*factor)) };
    h *= factor;
    if (Math.abs(h) < 1e-10) return null;
  }
  return null;
}
export interface Orbit { points: Point[]; times: number[]; reason: string; }
export function integrate(field: Field, seed: Point, t: number, duration: number, bounds: Bounds,
  direction = 1, tolerance = 1e-6, limit = 2500): Orbit {
  const points: Point[] = [[...seed]], times = [t];
  const end = t+direction*duration;
  let h = direction*0.02, reason = 'Tiempo completado';
  for (let i = 0; i < limit; i++) {
    if (direction*(end-t) <= 1e-10) return { points,times,reason };
    h = direction*Math.min(Math.abs(h),Math.abs(end-t));
    const step = adaptiveStep(field,points[points.length-1],t,h,tolerance);
    if (!step) { reason = 'Singularidad o precisión insuficiente'; break; }
    const [x,y] = step.point;
    if (x < bounds[0] || x > bounds[1] || y < bounds[2] || y > bounds[3]) { reason = 'Salida del encuadre'; break; }
    points.push(step.point); times.push(step.t); t = step.t; h = step.next;
    if (i === limit-1) reason = 'Límite de pasos';
  }
  return { points,times,reason };
}
export interface Equilibrium { point: Point; kind: string; trace: number; determinant: number; }
export function jacobian(field: Field, x: number, y: number, t = 0): number[] {
  const h = 1e-5*(1+Math.max(Math.abs(x),Math.abs(y)));
  const a = field(x+h,y,t), b = field(x-h,y,t), c = field(x,y+h,t), d = field(x,y-h,t);
  return [(a[0]-b[0])/(2*h),(c[0]-d[0])/(2*h),(a[1]-b[1])/(2*h),(c[1]-d[1])/(2*h)];
}
export function equilibria(field: Field, bounds: Bounds): Equilibrium[] {
  const result: Equilibrium[] = [];
  const scale = Math.max(bounds[1]-bounds[0],bounds[3]-bounds[2]);
  for (let ix = 0; ix <= 10; ix++) for (let iy = 0; iy <= 10; iy++) {
    let x = bounds[0]+(bounds[1]-bounds[0])*ix/10, y = bounds[2]+(bounds[3]-bounds[2])*iy/10;
    for (let i = 0; i < 35; i++) {
      const [u,v] = field(x,y,0), [a,b,c,d] = jacobian(field,x,y);
      const det = a*d-b*c;
      if (![u,v,a,b,c,d].every(Number.isFinite)) break;
      if (Math.hypot(u,v) < 1e-8) {
        if (x < bounds[0] || x > bounds[1] || y < bounds[2] || y > bounds[3] || result.some(e => Math.hypot(e.point[0]-x,e.point[1]-y)<scale*1e-4)) break;
        const trace = a+d, discriminant = trace*trace-4*det;
        const kind = det < -1e-7 ? 'Silla' : Math.abs(det)<1e-7 || Math.abs(trace)<1e-7
          ? 'No hiperbólico: estabilidad no concluyente' : `${discriminant < 0 ? 'Foco' : 'Nodo'} ${trace < 0 ? 'estable' : 'inestable'}`;
        result.push({point:[x,y],kind,trace,determinant:det}); break;
      }
      if (Math.abs(det) < 1e-12) break;
      const dx = (d*u-b*v)/det, dy = (-c*u+a*v)/det;
      const damping = Math.min(1,scale/(2*Math.max(Math.abs(dx),Math.abs(dy))));
      x -= damping*dx; y -= damping*dy;
      if (Math.max(Math.abs(x),Math.abs(y))>1e8) break;
    }
  }
  return result.slice(0,40);
}
