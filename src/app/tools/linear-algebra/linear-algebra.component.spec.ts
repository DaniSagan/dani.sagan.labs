import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LinearAlgebraComponent } from './linear-algebra.component';

describe('Linear algebra laboratory',()=>{
  let fixture:ComponentFixture<LinearAlgebraComponent>,c:LinearAlgebraComponent;
  beforeEach(async()=>{await TestBed.configureTestingModule({imports:[LinearAlgebraComponent],providers:[provideRouter([])]}).compileComponents();fixture=TestBed.createComponent(LinearAlgebraComponent);c=fixture.componentInstance;fixture.detectChanges();});
  afterEach(()=>fixture.destroy());
  it('preserves valid calculations after an invalid edit',()=>{const before=c.matrix;c.text='bad 1 1';c.apply();expect(c.error).toBeTruthy();expect(c.matrix).toBe(before);});
  it('forbids irreversible operations and supports undo',()=>{c.operation='scale';c.factor='0';c.rowOperation();expect(c.error).toContain('reversible');expect(c.history.length).toBe(1);c.factor='2';c.rowOperation();expect(c.history.length).toBe(2);c.undo();expect(c.work[0][0].toString()).toBe('1');});
  it('discovers exceptional values in an edited custom family',()=>{c.text='t 1 0;1 t 0';c.apply();expect(c.cases.map(v=>v.t)).toEqual(['-1','1']);c.t='1';c.apply();expect(c.analysis.kind).toBe('Compatible indeterminado');});
  it('hides answers in practice while retaining manual operations',()=>{c.practice=true;fixture.detectChanges();expect(fixture.nativeElement.querySelector('.metrics')).toBeNull();expect(fixture.nativeElement.querySelector('.row-controls')).toBeTruthy();c.reveal=true;fixture.detectChanges();expect(fixture.nativeElement.querySelector('.metrics')).toBeTruthy();});
  it('restores shared matrices before final rendering',()=>{const url=location.href;try{history.replaceState(null,'','?linear='+encodeURIComponent(JSON.stringify({matrix:'1 0 2;0 1 3',t:'0',view:'system'})));fixture.destroy();fixture=TestBed.createComponent(LinearAlgebraComponent);c=fixture.componentInstance;expect(()=>fixture.detectChanges()).not.toThrow();expect(c.solution).toContain('(2, 3)');}finally{history.replaceState(null,'',url);}});
  it('transfers the current matrix to the existing continuous dynamics tool',()=>{c.choose(c.examples.find(e=>e.id==='fibonacci')!);const s=JSON.parse(c.dynamicQuery['field']);expect(s.dx).toBe('(1)*x+(1)*y');expect(s.dy).toBe('(1)*x+(0)*y');});
  it('keeps zoom fixed when rotating and zooms with the wheel within bounds',()=>{
    spyOn(c.canvas.nativeElement,'setPointerCapture');c.zoom=2;
    c.startDrag(new PointerEvent('pointerdown',{pointerId:1,clientX:100,clientY:100}));
    const yaw=c.yaw;c.moveDrag(new PointerEvent('pointermove',{pointerId:1,clientX:140,clientY:120}));expect(c.zoom).toBe(2);expect(c.yaw).toBeLessThan(yaw);
    const wheel=new WheelEvent('wheel',{deltaY:-200,cancelable:true});c.wheelZoom(wheel);expect(wheel.defaultPrevented).toBeTrue();expect(c.zoom).toBeGreaterThan(2);
    for(let i=0;i<10;i++)c.wheelZoom(wheel);expect(c.zoom).toBe(5);
  });
  it('pinches without rotating and resumes one-finger rotation without a jump',()=>{
    spyOn(c.canvas.nativeElement,'setPointerCapture');
    c.startDrag(new PointerEvent('pointerdown',{pointerId:1,clientX:100,clientY:100}));c.startDrag(new PointerEvent('pointerdown',{pointerId:2,clientX:200,clientY:100}));
    const yaw=c.yaw,pitch=c.pitch;c.moveDrag(new PointerEvent('pointermove',{pointerId:2,clientX:300,clientY:100}));expect(c.zoom).toBe(2);expect(c.yaw).toBe(yaw);expect(c.pitch).toBe(pitch);
    c.endDrag(new PointerEvent('pointerup',{pointerId:2}));c.endDrag(new PointerEvent('lostpointercapture',{pointerId:2}));
    c.moveDrag(new PointerEvent('pointermove',{pointerId:1,clientX:110,clientY:100}));expect(c.yaw).toBeCloseTo(yaw-0.08,10);expect(c.zoom).toBe(2);
  });
});
