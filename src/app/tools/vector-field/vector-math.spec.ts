import { adaptiveStep, compileField, equilibria, integrate, parameterNames } from './vector-math';
import { VECTOR_EXAMPLES } from './vector-examples';

describe('Vector field numerical engine', () => {
  it('detects parameters while reserving x, y, time and the mathematical catalog', () => {
    expect(parameterNames('a_1*x+sin(t)','b*y+1e-3+PI')).toEqual(['a_1','b']);
    expect(compileField('y','-a*x',{a:2})(3,4,0)).toEqual([4,-6]);
    expect(() => compileField('missing(x)','y',{})).toThrow();
    for (const expression of ['globalThis.location','sin.constructor("return window")()','x=2','(()=>1)()','x["constructor"]']) {
      expect(()=>compileField(expression,'y',{})).toThrow();
    }
  });
  it('integrates forward and backward with controlled error and conserves harmonic energy', () => {
    const field=compileField('y','-x',{});
    const orbit=integrate(field,[1,0],0,2*Math.PI,[-2,2,-2,2],1,1e-8);
    expect(orbit.reason).toBe('Tiempo completado');
    const last=orbit.points[orbit.points.length-1];
    expect(last[0]).toBeCloseTo(1,6);expect(last[1]).toBeCloseTo(0,6);
    for(const p of orbit.points)expect(p[0]*p[0]+p[1]*p[1]).toBeCloseTo(1,6);
    const backward=integrate(field,[1,0],0,Math.PI/2,[-2,2,-2,2],-1,1e-8);
    expect(backward.points[backward.points.length-1][1]).toBeCloseTo(1,6);
  });
  it('evaluates forces at stage time rather than freezing the temporal field', () => {
    const orbit=integrate(compileField('cos(t)','sin(t)',{}),[0,0],0,Math.PI,[-3,3,-3,3],1,1e-8);
    expect(orbit.points[orbit.points.length-1][0]).toBeCloseTo(0,6);
    expect(orbit.points[orbit.points.length-1][1]).toBeCloseTo(2,6);
  });
  it('halts at singularities, framing and work limits', () => {
    expect(adaptiveStep(()=>[NaN,0],[1,0],0,0.1)).toBeNull();
    expect(adaptiveStep(()=>[1,0],[1,0],0,0)).toBeNull();
    expect(integrate(()=>[1,0],[0,0],0,10,[-1,1,-1,1]).reason).toBe('Salida del encuadre');
    expect(integrate(()=>[1,0],[0,0],0,100,[-100,100,-100,100],1,1e-6,2).reason).toBe('Límite de pasos');
  });
  it('locates and classifies hyperbolic equilibria without overclaiming center stability', () => {
    const sink=equilibria(compileField('-x-y','x-y',{}),[-2,2,-2,2]);
    expect(sink.length).toBe(1);expect(sink[0].kind).toBe('Foco estable');
    expect(equilibria(compileField('x','-y',{}),[-2,2,-2,2])[0].kind).toBe('Silla');
    expect(equilibria(compileField('y','-x',{}),[-2,2,-2,2])[0].kind).toContain('No hiperbólico');
    expect(equilibria(compileField('x-x**3','-y',{}),[-2,2,-2,2]).length).toBe(3);
  });
  it('keeps distinct gallery ids, valid parameter metadata and finite representative trajectories', () => {
    expect(VECTOR_EXAMPLES.length).toBeGreaterThan(40);
    expect(new Set(VECTOR_EXAMPLES.map(e=>e.id)).size).toBe(VECTOR_EXAMPLES.length);
    for(const e of VECTOR_EXAMPLES){
      expect(e.id).toMatch(/^[a-z0-9-]+$/);
      expect(parameterNames(e.dx,e.dy).sort()).withContext(e.id).toEqual(e.parameters.map(p=>p.name).sort());
      for(const p of e.parameters){expect(p.min).toBeLessThan(p.max);expect(p.value).toBeGreaterThanOrEqual(p.min);expect(p.value).toBeLessThanOrEqual(p.max);}
      const fn=compileField(e.dx,e.dy,Object.fromEntries(e.parameters.map(p=>[p.name,p.value])));
      expect(e.seeds.every(p=>fn(...p,0).every(Number.isFinite))).withContext(e.id).toBeTrue();
      const orbit=integrate(fn,e.seeds[0],0,2,e.bounds);
      expect(orbit.points.length).withContext(e.id).toBeGreaterThan(2);
      expect(orbit.points.every(p=>p.every(Number.isFinite))).withContext(e.id).toBeTrue();
    }
  });
});
