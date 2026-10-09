import { DISTRIBUTIONS, makeLaw } from './distributions';
import { PROBABILITY_EXAMPLES } from './probability-examples';
import { ANSCOMBE, confidenceInterval, parseData, regression, summarize, syntheticData, bootstrap, permutationDifference } from './statistics';
import { benchmark, experiment } from './experiments';
import { seededRandom } from '../../shared/math/central-limit';

describe('Probability laboratory mathematical models', () => {
  for (const spec of DISTRIBUTIONS) {
    it(`${spec.id}: monotone CDF, inverse quantiles and reproducible samples`, () => {
      const law=makeLaw(spec.id),rng=seededRandom(42),same=seededRandom(42);
      expect(law.cdf(-Infinity)).toBe(0);expect(law.cdf(Infinity)).toBe(1);
      let previous=0;
      for(const p of [0.001,0.01,0.1,0.5,0.9,0.99,0.999]){
        const x=law.quantile(p),cdf=law.cdf(x);
        expect(Number.isFinite(x)).toBeTrue();
        expect(cdf).toBeGreaterThanOrEqual(previous-1e-8);
        if(spec.discrete){expect(cdf+1e-10).toBeGreaterThanOrEqual(p);expect(law.cdf(x-1)).toBeLessThan(p+1e-8);}
        else expect(cdf).toBeCloseTo(p,6);
        previous=cdf;
      }
      for(let i=0;i<100;i++){const x=law.sample(rng);expect(x).toBe(law.sample(same));expect(Number.isFinite(x)).toBeTrue();if(spec.discrete)expect(Number.isInteger(x)).toBeTrue();}
    });
  }
  it('every distribution preset has valid parameters and bounds',()=>{
    const ids=new Set<string>();
    for(const e of PROBABILITY_EXAMPLES){expect(ids.has(e.id)).toBeFalse();ids.add(e.id);if(e.mode==='distribution'){const law=makeLaw(e.model,e.values);expect(law.bounds[0]).toBeLessThan(law.bounds[1]);expect(law.pdf(law.quantile(0.5))).toBeGreaterThanOrEqual(0);}}
  });
  it('agrees with reference quantiles and elementary probabilities',()=>{
    expect(makeLaw('normal').quantile(0.975)).toBeCloseTo(1.9599639845,5);
    expect(makeLaw('student',{nu:9}).quantile(0.975)).toBeCloseTo(2.26215716,5);
    expect(makeLaw('chi-square',{nu:2}).cdf(2)).toBeCloseTo(1-Math.exp(-1),8);
    expect(makeLaw('beta',{a:1,b:1}).cdf(0.37)).toBeCloseTo(0.37,8);
    expect(makeLaw('binomial',{n:10,p:0.5}).pdf(5)).toBeCloseTo(252/1024,8);
    expect(makeLaw('poisson',{lambda:3}).pdf(0)).toBeCloseTo(Math.exp(-3),8);
    expect(makeLaw('cauchy').mean).toBeNull();expect(makeLaw('pareto',{a:1}).variance).toBeNull();
    expect(()=>makeLaw('normal',{s:0})).toThrow();
  });
  it('retains the similar summaries of all four Anscombe datasets',()=>{
    ANSCOMBE.forEach(data=>{const stats=summarize(data.map(p=>p.y)),fit=regression(data);expect(stats.mean).toBeCloseTo(7.5,2);expect(stats.variance).toBeCloseTo(4.12,1);expect(fit.slope!).toBeCloseTo(0.5,2);expect(fit.r!).toBeCloseTo(0.816,2);});
  });
  it('demonstrates Simpson reversal without mislabelling group fits',()=>{
    const data=syntheticData('simpson',seededRandom(2026));expect(regression(data).slope!).toBeLessThan(0);
    for(const group of [0,1])expect(regression(data.filter(p=>p.group===group)).slope!).toBeGreaterThan(0);
  });
  it('uses Student uncertainty and deterministic resampling',()=>{
    const x=[1,2,3,4,5],ci=confidenceInterval(x,0.95);expect(ci[0]).toBeCloseTo(1.03675684,5);expect(ci[1]).toBeCloseTo(4.96324316,5);
    expect(bootstrap(x,seededRandom(7))).toBe(bootstrap(x,seededRandom(7)));
    expect(permutationDifference(x,[6,7,8],seededRandom(7))).toBe(permutationDifference(x,[6,7,8],seededRandom(7)));
    expect(()=>parseData('1 nope')).toThrow();expect(parseData('1 2 0\n3 4 1')).toEqual([{x:1,y:2,group:0},{x:3,y:4,group:1}]);
    expect(regression([{x:1,y:1,group:0},{x:1,y:2,group:0}]).slope).toBeNull();
  });
  for(const model of ['bertrand-angle','bertrand-radius','bertrand-area','monty','birthday','pi','matching','benford']){
    it(`${model}: seeded simulation approaches its theoretical value`,()=>{
      const rng=seededRandom(12345),n=23,p=0.5,B=12000;let sum=0;
      for(let i=0;i<B;i++)sum+=experiment(model,n,p,rng).value;
      expect(Math.abs(sum/B-benchmark(model,n,p).value!)).toBeLessThan(model==='pi'?0.045:0.025);
    });
  }
});
