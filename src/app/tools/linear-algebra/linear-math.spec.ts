import { determinant, expression, inverse, leastSquares, multiply, parseMatrix, Q, reduce, spectrum, transpose } from './linear-math';
import { LINEAR_EXAMPLES } from './linear-examples';
import { studyParameter } from './parameter-polynomial';

describe('Exact linear algebra',()=>{
  it('parses rational expressions safely and respects powers and unary signs',()=>{
    expect(expression('-t^2+1/3',new Q(2)).toString()).toBe('-11/3');
    expect(expression('(t-1)^2/2',new Q(3)).toString()).toBe('2');
    for(const s of ['window.alert(1)','t.constructor','1/0','t=2','2^99','sin(t)'])expect(()=>expression(s,new Q(1))).toThrow();
  });
  it('classifies all solution dimensions and contradictions',()=>{
    const unique=reduce(parseMatrix('1 1 2;1 -1 0','1'));expect(unique.particular.map(q=>q.toString())).toEqual(['1','1']);
    const line=reduce(parseMatrix('1 1 1 2;2 2 2 4;1 -1 0 0','1'));expect(line.rank).toBe(2);expect(line.kernel.length).toBe(1);
    const bad=reduce(parseMatrix('1 2 3;2 4 7','1'));expect(bad.rank).toBe(1);expect(bad.augmentedRank).toBe(2);
    expect(reduce(parseMatrix('0 0 0 0','1')).kernel.length).toBe(3);
  });
  it('satisfies Ax=b and Av=0 for every consistent gallery example',()=>{
    expect(LINEAR_EXAMPLES.length).toBeGreaterThan(60);
    for(const e of LINEAR_EXAMPLES){const a=parseMatrix(e.matrix,e.t),r=reduce(a),A=a.map(row=>row.slice(0,-1));
      if(r.kind!=='Incompatible')expect(multiply(A,r.particular.map(q=>[q])).map(row=>row[0].toString())).withContext(e.id).toEqual(a.map(row=>row[row.length-1].toString()));
      for(const v of r.kernel)expect(multiply(A,v.map(q=>[q])).every(row=>row[0].zero)).withContext(e.id).toBeTrue();
      for(const c of e.critical)try{reduce(parseMatrix(e.matrix,c));}catch{expect(['rational-pole','squeeze','hyperbolic']).toContain(e.id);}
    }
  });
  it('computes an exact inverse and detects singular matrices',()=>{
    const a=parseMatrix('2 1 0;1 2 0','1').map(r=>r.slice(0,-1));expect(determinant(a).toString()).toBe('3');
    expect(multiply(a,inverse(a)!).map(r=>r.map(q=>q.toString()))).toEqual([['1','0'],['0','1']]);
    expect(inverse(parseMatrix('1 2 0;2 4 0','1').map(r=>r.slice(0,-1)))).toBeNull();
  });
  it('makes residual orthogonal to column space even in rank deficient fits',()=>{
    for(const e of LINEAR_EXAMPLES){const a=parseMatrix(e.matrix,e.t),A=a.map(r=>r.slice(0,-1)),fit=leastSquares(a),pred=multiply(A,fit.particular.map(q=>[q]));
      const residual=pred.map((r,i)=>[r[0].sub(a[i][a[i].length-1])]);expect(multiply(transpose(A),residual).every(r=>r[0].zero)).withContext(e.id).toBeTrue();}
  });
  it('keeps tiny singular values when the direct quadratic formula would cancel',()=>{
    const s=spectrum([[1,1],[1,1.00000001]]);expect(s.singular[1]).toBeGreaterThan(0);expect(s.condition).toBeGreaterThan(1e8);
    expect(spectrum([[0,-1],[1,0]]).real).toBeFalse();expect(spectrum([[1,0],[0,0]]).condition).toBe(Infinity);
  });
  it('finds exact exceptional parameters from a symbolic determinant',()=>{
    const s=studyParameter('t 1 0 1;1 t 0 1;0 0 t-2 1');expect(s.roots.map(r=>r.exact)).toEqual(['-1','1','2']);
    expect(studyParameter('t 0 0;0 t 0').roots.map(r=>r.exact)).toEqual(['0']);
    const irrational=studyParameter('t 2 0;1 t 0');expect(irrational.roots.length).toBe(2);expect(irrational.roots.every(r=>r.exact===null)).toBeTrue();
  });
});
