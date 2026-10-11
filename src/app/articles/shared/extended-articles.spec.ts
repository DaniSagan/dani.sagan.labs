import { ALGEBRA_ARTICLES } from '../algebra/algebra-articles';
import { ANALYSIS_ARTICLES } from '../analysis/analysis-articles';
import { CALCULUS_ARTICLES } from '../calculus/calculus-articles';
import { COMBINATORICS_ARTICLES } from '../combinatorics/combinatorics-articles';
import { COMPLEX_NUMBERS_ARTICLES } from '../complex-numbers/complex-numbers-articles';
import { DYNAMICAL_SYSTEMS_ARTICLES } from '../dynamical-systems/dynamical-systems-articles';
import { FRACTALS_ARTICLES } from '../fractals/fractals-articles';
import { GEOMETRY_ARTICLES } from '../geometry/geometry-articles';
import { NUMBER_THEORY_ARTICLES } from '../number-theory/number-theory-articles';
import { PROBABILITY_ARTICLES } from '../probability/probability-articles';
import { TRIGONOMETRY_ARTICLES } from '../trigonometry/trigonometry-articles';
import { PROBLEMS } from '../../problems/problems.data';
import { ArticlesProviderServiceService } from '../../shared/content/articles-provider-service.service';
import { NavbarSubsection } from '../../shared/content/navbar-subsection';
import { sampleExperiment } from './topic-sampling';
const ADDED=["jordan-form","cayley-hamilton","mean-inequalities","prime-valuations","frobenius-coins","permutation-symmetries","apollonius-circles","quadratic-conics","vector-products","triangle-metrics","height-surveying","de-moivre","phasor-superposition","trigonometric-equations","asymptotic-limits","squeeze-oscillation","monotone-convergence","mean-value-theorems","convexity-tangents","function-analysis","harmonic-oscillator","arc-length","areas-revolution","conditional-independence","discrete-expectation","descriptive-statistics","bessel-correction","sampling-distributions","graphical-diagnostics","grid-counting","reflection-principle","life-patterns","fractal-measure-dimension","solar-geometry","utc-date-arithmetic"];
describe('Extended article integration',()=>{
 it('registers each article exactly once, exposes it in navigation, and links it from a problem',()=>{
  const catalog=[...ALGEBRA_ARTICLES,...ANALYSIS_ARTICLES,...CALCULUS_ARTICLES,...COMBINATORICS_ARTICLES,...COMPLEX_NUMBERS_ARTICLES,...DYNAMICAL_SYSTEMS_ARTICLES,...FRACTALS_ARTICLES,...GEOMETRY_ARTICLES,...NUMBER_THEORY_ARTICLES,...PROBABILITY_ARTICLES,...TRIGONOMETRY_ARTICLES];
  const flatten=(sections:NavbarSubsection[]):string[]=>sections.flatMap(s=>[...s.items.map(i=>i.route),...flatten(s.subsections||[])]);
  const routes=flatten(new ArticlesProviderServiceService().getNavbar().subsections!);
  for(const slug of ADDED){
   expect(catalog.filter(a=>a.route===slug).length).toBe(1);
   expect(routes.filter(r=>r===slug).length).toBe(1);
   expect(PROBLEMS.some(p=>p.resources.some(r=>r.route==='/articles/'+slug))).toBeTrue();
  }
 });
 it('reproduces sample sequences and computes frequencies and statistics from their outcomes',()=>{
  for(const [topic,parameter] of [['bessel-correction',4],['sampling-distributions',36],['discrete-expectation',4]] as [string,number][]){
   const a=sampleExperiment(topic,parameter,200,1234),b=sampleExperiment(topic,parameter,200,1234),long=sampleExperiment(topic,parameter,400,1234);
   expect(a.values).toEqual(b.values);expect(long.values.slice(0,200)).toEqual(a.values);
   expect(a.values.length).toBe(200);expect(a.values.every(Number.isFinite)).toBeTrue();
   expect(a.mean).toBeCloseTo(a.values.reduce((s,x)=>s+x,0)/200,12);
   expect(a.variance).toBeCloseTo(a.values.reduce((s,x)=>s+(x-a.mean)**2,0)/200,12);
   expect(a.series[0].points.reduce((s,p)=>s+p[1],0)).toBeCloseTo(1,12);
  }
 });
});
