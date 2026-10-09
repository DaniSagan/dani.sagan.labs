import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ProbabilityLabComponent } from './probability-lab.component';

describe('ProbabilityLabComponent',()=>{
  let fixture:ComponentFixture<ProbabilityLabComponent>,component:ProbabilityLabComponent;
  beforeEach(async()=>{
    spyOn(window,'fetch').and.resolveTo(new Response('dataset,x,y\ndino,1,2\ndino,3,4',{status:200}));
    await TestBed.configureTestingModule({imports:[ProbabilityLabComponent],providers:[provideRouter([])]}).compileComponents();
    fixture=TestBed.createComponent(ProbabilityLabComponent);component=fixture.componentInstance;fixture.detectChanges();
  });
  afterEach(()=>fixture.destroy());
  it('renders both persistent canvases and resets a reproducible random stream',()=>{
    expect(component.series.nativeElement).toBeTruthy();component.run(1);const first=component.samples[0];component.reset();component.run(1);expect(component.samples[0]).toBe(first);
  });
  it('explains the empty graph and renders the first observation as a visible point',()=>{
    const ctx=component.series.nativeElement.getContext('2d')!,text=spyOn(ctx,'fillText').and.callThrough(),arc=spyOn(ctx,'arc').and.callThrough();
    component.paint();expect(text.calls.allArgs().some(args=>String(args[0]).includes('Simular 1000'))).toBeTrue();
    component.run(1);expect(component.history.length).toBe(1);expect(component.history[0].estimate).toBe(component.samples[0]);expect(arc).toHaveBeenCalled();
  });
  it('records convergence from the first sample rather than only at batch boundaries',()=>{
    component.run(100);expect(component.history.length).toBe(100);
    let sum=0;component.samples.forEach((sample,i)=>{sum+=sample;expect(component.history[i].n).toBe(i+1);expect(component.history[i].estimate).toBeCloseTo(sum/(i+1),10);});
    component.run(1);expect(component.history.length).toBe(101);component.reset();expect(component.history.length).toBe(0);
  });
  it('loads the original Datasaurus group using its complete prefix',async()=>{
    component.choose(component.examples.find(e=>e.id==='datasaurus-dino')!);await component["dataReady"];await Promise.resolve();fixture.detectChanges();expect(component.data.length).toBe(2);expect(component.data[0]).toEqual({x:1,y:2,group:0});expect(component.error).toBe('');
  });
  it('rejects invalid quantiles and Bayesian inputs without breaking rendering',()=>{
    component.q=2;component.redraw();fixture.detectChanges();expect(component.selectedQuantile).toBeNull();expect(component.error).toBeTruthy();
    component.choose(component.examples.find(e=>e.id==='beta-bayes-uniform')!);const previous=component.posteriorLaw;component.parameters[0].value=0;component.apply();fixture.detectChanges();expect(component.error).toBeTruthy();expect(component.posteriorLaw).toBe(previous);
    component.choose(component.examples.find(e=>e.id==='bayes-rare')!);component.parameters[0].value=2;component.apply();fixture.detectChanges();expect(component.resultBayes.posterior!).toBeCloseTo(0.161016949,5);
  });
  it('updates the example identity when changing distribution families',()=>{
    component.model='poisson';component.changeLaw();expect(component.selected.model).toBe('poisson');expect(component.law.spec.id).toBe('poisson');
  });
  it('allows simulation after correcting an invalid sample size',()=>{
    component.choose(component.examples.find(e=>e.id==='inference-normal')!);component.sampleSize=1;component.run(1);expect(component.error).toBeTruthy();expect(component.samples.length).toBe(0);component.sampleSize=20;component.reset();component.run(1);expect(component.error).toBe('');expect(component.samples.length).toBe(1);
  });
});
