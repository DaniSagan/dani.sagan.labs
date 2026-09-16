import { EULER_MASCHERONI, eulerApproximations, harmonicBounds, harmonicGap, harmonicNumber } from './euler-mascheroni';

describe('Constante de Euler–Mascheroni',()=>{
  it('calcula sumas armónicas conocidas sin usar gamma',()=>{
    expect(harmonicNumber(1)).toBe(1);
    expect(harmonicNumber(4)).toBeCloseTo(25/12,14);
    expect(harmonicNumber(100000)).toBeCloseTo(12.090146129863428,12);
    expect(harmonicNumber(4)).toBeCloseTo(25/12,14);
  });
  it('produce cotas monótonas y una anchura consistente',()=>{
    let previous=harmonicBounds(1);
    for(let n=2;n<=500;n++){
      const b=harmonicBounds(n);
      expect(b.lower).toBeLessThan(EULER_MASCHERONI);expect(b.upper).toBeGreaterThan(EULER_MASCHERONI);
      expect(b.lower).toBeGreaterThan(previous.lower);expect(b.upper).toBeLessThan(previous.upper);
      expect(b.upper-b.lower).toBeCloseTo(b.width,12);previous=b;
    }
  });
  it('relaciona los excesos geométricos con la aproximación inferior',()=>{
    let area=0;
    for(let n=1;n<=40;n++){
      expect(harmonicGap(n)).toBeGreaterThan(0);area+=harmonicGap(n);
      expect(area).toBeCloseTo(harmonicBounds(n).lower,13);
    }
  });
  it('reduce el error mediante las correcciones con los signos adecuados',()=>{
    const errors=eulerApproximations(10).map(v=>Math.abs(v-EULER_MASCHERONI));
    errors.slice(1).forEach((e,i)=>expect(e).toBeLessThan(errors[i]));
    expect(errors[0]).toBeGreaterThan(0.049);
    expect(errors[3]).toBeLessThan(4e-9);expect(errors[3]).toBeGreaterThan(3.8e-9);
    expect(Math.abs(eulerApproximations(1000)[3]-EULER_MASCHERONI)).toBeLessThan(1e-14);
  });
  it('rechaza entradas fuera del dominio computacional',()=>{
    [0,-1,1.5,NaN,Infinity,100001].forEach(n=>expect(()=>harmonicNumber(n)).toThrowError(RangeError));
  });
});
