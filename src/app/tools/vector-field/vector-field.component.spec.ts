import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VectorFieldComponent } from './vector-field.component';

describe('VectorFieldComponent', () => {
  let fixture: ComponentFixture<VectorFieldComponent>, component: VectorFieldComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports:[VectorFieldComponent]}).compileComponents();
    fixture=TestBed.createComponent(VectorFieldComponent);component=fixture.componentInstance;
    fixture.detectChanges();component.running=false;
  });
  afterEach(()=>fixture.destroy());
  it('projects compact parameter controls below the canvas and before settings', () => {
    const canvas=fixture.nativeElement.querySelector('.phase-canvas'),parameters=fixture.nativeElement.querySelector('.parameters'),settings=fixture.nativeElement.querySelector('.settings');
    expect(canvas.compareDocumentPosition(parameters)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(parameters.compareDocumentPosition(settings)&Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(component.orbits.length).toBe(4);
  });
  it('restores model defaults and keeps time-dependent fields out of equilibrium classification', () => {
    component.choose(component.examples.find(e=>e.id==='duffing-forced')!);
    expect(component.timeDependent).toBeTrue();expect(component.fixedPoints.length).toBe(0);
    component.choose(component.examples.find(e=>e.id==='damped')!);
    expect(component.parameters[0].value).toBe(0.35);
    expect(component.fixedPoints[0].kind).toBe('Foco estable');
  });
  it('bounds seed counts and preserves the zoom during parameter redraw', () => {
    component.seedGrid();expect(component.seeds.length).toBe(25);
    for(let i=0;i<10;i++)component.addSeed([0,0]);expect(component.seeds.length).toBe(32);
    component.undo();expect(component.seeds.length).toBe(31);
    component.bounds=[-1.5,1.5,-2,2];component.parameters[0].value=0.7;component.apply();
    expect(component.bounds).toEqual([-1.5,1.5,-2,2]);
    component.clear();expect(component.orbits.length).toBe(0);
  });
  it('retains valid trajectories when an expression is invalid', () => {
    const before=component.orbits;component.dx='sin(';component.apply();
    expect(component.error.length).toBeGreaterThan(0);expect(component.orbits).toBe(before);
    component.dx='y';component.dy='-x';component.apply();expect(component.error).toBe('');
  });
  it('searches models accent independently and validates integer parameters', () => {
    component.search='pendulo';expect(component.filtered.length).toBe(2);
    component.choose(component.examples.find(e=>e.id==='flower-flow')!);
    const n=component.parameters.find(p=>p.name==='n')!;n.value=3.5;component.changeParameter(n);
    expect(n.error).toContain('enteros');
  });
  it('restores shared equations, framing and individual launch times', () => {
    const original=location.href;
    const state={dx:'y',dy:'-x',bounds:[-4,4,-3,3],parameters:[],duration:10,t:0,seeds:[{point:[1,0],t:1.5,color:'#fff'}]};
    try {
      history.replaceState(null,'','?field='+encodeURIComponent(JSON.stringify(state)));
      fixture.destroy();fixture=TestBed.createComponent(VectorFieldComponent);component=fixture.componentInstance;
      fixture.detectChanges();component.running=false;
      expect(component.selected.name).toBe('Sistema compartido');
      expect(component.selected.dx).toBe(component.dx);
      expect(component.selected.bounds).toEqual([-4,4,-3,3]);
      expect(component.seeds[0].t).toBe(1.5);
      expect(component.orbits[0].forward.times[0]).toBe(1.5);
      expect(component.error).toBe('');
    } finally {history.replaceState(null,'',original);}
  });
});
