import { cantorIntervals, computeTopic, lifeStep, TOPIC_CONFIGS } from './topic-lab-model';
import { TopicLabComponent } from './topic-lab.component';

describe('Extended article laboratories',()=>{
 for(const [topic,config] of Object.entries(TOPIC_CONFIGS)){
  it(topic+' produces finite geometry at defaults and all control boundaries',()=>{
   const values=config.controls.map(c=>c.value);
   const cases=[values,...config.controls.flatMap((c,i)=>[c.min,c.max].map(v=>values.map((x,j)=>j===i?v:x)))];
   for(const input of cases){
    const result=computeTopic(topic,input);
    expect(result.bounds.every(Number.isFinite)).toBeTrue();
    expect(result.bounds[1]).toBeGreaterThan(result.bounds[0]);
    expect(result.bounds[3]).toBeGreaterThan(result.bounds[2]);
    for(const series of result.series)for(const point of series.points)expect(point.every(Number.isFinite)).toBeTrue();
    for(const p of result.markers)expect(Number.isFinite(p.x)&&Number.isFinite(p.y)).toBeTrue();
    expect(result.readouts.length).toBeGreaterThan(0);
   }
  });
 }
 const value=(topic:string,input:number[],label:string)=>Number(computeTopic(topic,input).readouts.find(([name])=>name===label)![1]);
 it('uses Jordan chains and agrees with direct matrix powers',()=>{
  expect(computeTopic('jordan-form',[1,4]).readouts[0][1]).toBe('(4, 1)');
  let A=[[1,0],[0,1]];
  for(let n=0;n<=12;n++){
   const r=computeTopic('cayley-hamilton',[n]);
   expect(Number(r.table![0][0])).toBeCloseTo(A[0][0],0);
   expect(Number(r.table![0][1])).toBeCloseTo(A[0][1],0);
   A=A.map(row=>[2*row[0]+row[1],row[0]+2*row[1]]);
  }
 });
 it('satisfies mean inequalities throughout the positive family',()=>{
  for(let a=.1;a<10;a+=.1){
   const G=value('mean-inequalities',[a],'Media geométrica'),H=value('mean-inequalities',[a],'Media armónica');
   expect(H).toBeLessThanOrEqual(G+1e-5);expect(G).toBeLessThanOrEqual(5+1e-5);
  }
 });
 it('preserves Apollonius distance ratios and separates the mediatrix',()=>{
  for(const k of [.2,.95,1.05,2,3]){
   const r=computeTopic('apollonius-circles',[k]);
   for(const [x,y] of r.series[0].points)expect(Math.hypot(x-1,y)/Math.hypot(x+1,y)).toBeCloseTo(k,10);
  }
  expect(computeTopic('apollonius-circles',[1]).series[0].points).toEqual([[0,-4],[0,4]]);
 });
 it('finds the sole nonnegative coin representation and returns permutation identity at twelve',()=>{
  expect(computeTopic('frobenius-coins',[100]).table).toEqual([['Monedas de 7','Monedas de 11'],['8','4']]);
  expect(computeTopic('permutation-symmetries',[12]).table).toEqual(Array.from({length:7},(_,i)=>[String(i+1),String(i+1)]));
 });
 it('produces all complex roots, preserves the oscillator radius, and cancels opposite phasors',()=>{
  const roots=computeTopic('de-moivre',[4,180]).series[0].points.slice(0,4);
  for(const [x,y] of roots){expect(Math.hypot(x,y)).toBeCloseTo(1,12);expect(x**4-6*x*x*y*y+y**4).toBeCloseTo(-1,12);}
  const marker=computeTopic('harmonic-oscillator',[2,3]).markers[0];
  expect(marker.x**2+marker.y**2).toBeCloseTo(4,12);
  expect(value('phasor-superposition',[180],'Amplitud resultante')).toBeLessThan(1e-10);
 });
 it('matches exact geometry and improves arc length with refinement',()=>{
  expect(value('triangle-metrics',[6],'Área')).toBeCloseTo(6*Math.sqrt(6),4);
  expect(value('height-surveying',[60],'Altura relativa (m)')).toBeCloseTo(10*Math.sqrt(3),4);
  const coarse=value('arc-length',[4],'Error'),fine=value('arc-length',[40],'Error');
  expect(fine).toBeLessThan(coarse);expect(fine).toBeGreaterThan(0);
  expect(value('areas-revolution',[2],'Área')).toBeCloseTo(1/6,5);
  expect(value('areas-revolution',[2],'Volumen de arandelas')).toBeCloseTo(2*Math.PI/15,5);
 });
 it('normalizes all conditional tables and keeps game variance independent of price',()=>{
  for(const r of [0,.1,.2,.4]){
   const result=computeTopic('conditional-independence',[r]);
   const cells=result.series[0].points.map(p=>p[1]);expect(cells.every(x=>x>=0)).toBeTrue();expect(cells.reduce((s,x)=>s+x,0)).toBeCloseTo(1,12);
  }
  expect(value('discrete-expectation',[4],'Ganancia esperada')).toBe(-1.5);
  expect(value('discrete-expectation',[0],'Varianza')).toBe(value('discrete-expectation',[8],'Varianza'));
  expect(value('descriptive-statistics',[6],'Varianza descriptiva')).toBe(2);
  expect(value('sampling-distributions',[144],'Error estándar')).toBe(.5);
 });
 it('counts grid segments, Catalan paths, and Cantor intervals exactly',()=>{
  expect(value('grid-counting',[4],'Total')).toBe(69);
  expect(value('reflection-principle',[4],'Buenos (Catalan)')).toBe(14);
  for(let n=0;n<=7;n++){
   const intervals=cantorIntervals(n);expect(intervals.length).toBe(2**n);
   expect(intervals.reduce((s,[a,b])=>s+b-a,0)).toBeCloseTo((2/3)**n,12);
  }
 });
 it('updates life simultaneously on an unbounded grid',()=>{
  const seed=new Set(['-1,0','0,0','1,0']);
  const first=lifeStep(seed);expect([...first].sort()).toEqual(['0,-1','0,0','0,1']);
  expect([...lifeStep(first)].sort()).toEqual([...seed].sort());
  const block=new Set(['0,0','1,0','0,1','1,1']);expect([...lifeStep(block)].sort()).toEqual([...block].sort());
  let glider=new Set(['1,0','2,1','0,2','1,2','2,2']);
  for(let i=0;i<4;i++)glider=lifeStep(glider);
  expect([...glider].sort()).toEqual(['2,1','3,2','1,3','2,3','3,3'].sort());
 });
 it('computes ideal solar heights and carries dates across UTC offsets',()=>{
  expect(value('solar-geometry',[0],'Altura al mediodía')).toBeCloseTo(46.64,8);
  expect(value('solar-geometry',[23.44],'Altura al mediodía')).toBeCloseTo(70.08,8);
  expect(value('utc-date-arithmetic',[3],'Duración en minutos')).toBe(345);
  expect(value('utc-date-arithmetic',[-5],'Duración (horas)')).toBe(13.75);
 });
 it('retains equal spatial scale and resets all controls',()=>{
  const component=new TopicLabComponent();component.topic='apollonius-circles';component.ngOnChanges();
  const b=component.bounds;expect((b[1]-b[0])/(b[3]-b[2])).toBeCloseTo(624/284,12);
  component.values=[1];component.update();expect(component.result.readouts[0][1]).toBe('Recta x = 0');
  component.reset();expect(component.values).toEqual([2]);
 });
});
