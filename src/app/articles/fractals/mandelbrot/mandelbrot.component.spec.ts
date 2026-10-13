import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MandelbrotComponent } from './mandelbrot.component';
import { initialView, pointAt } from './mandelbrot-view';
describe('MandelbrotComponent', () => {
  let component: MandelbrotComponent,fixture: ComponentFixture<MandelbrotComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({imports:[MandelbrotComponent]}).compileComponents();
    fixture=TestBed.createComponent(MandelbrotComponent);component=fixture.componentInstance;fixture.detectChanges();
    spyOn(component.canvas.nativeElement,'getBoundingClientRect').and.returnValue({left:0,top:0,width:300,height:200,right:300,bottom:200,x:0,y:0,toJSON:()=>({})} as DOMRect);
  });
  afterEach(()=>fixture.destroy());
  it('initializes the interactive view without change detection errors',()=>{
    expect(component).toBeTruthy();expect(()=>fixture.detectChanges()).not.toThrow();
    expect(fixture.nativeElement.querySelectorAll('select[name=palette] option').length).toBe(6);
  });
  it('keeps zooming beyond floating point precision and the former zoom ceiling',()=>{
    component.view=initialView('-2','0',4096);component.zoomIn();
    expect(component.view.zoom).toBe(4097);expect(component.view.bits).toBeGreaterThan(4192);
    const a=pointAt(component.view,149,100,300,200),b=pointAt(component.view,150,100,300,200);
    expect(a[0]===b[0]).toBeFalse();
  });
  it('anchors wheel zoom at the mouse and prevents article scrolling',()=>{
    component.view=initialView('-2','0',1100);
    const before=component.view,point=pointAt(before,207,81,300,200);
    const event=new WheelEvent('wheel',{clientX:207,clientY:81,deltaY:-240,cancelable:true});component.onWheel(event);
    const after=pointAt(component.view,207,81,300,200),shift=BigInt(component.view.bits-before.bits);
    const real=after[0]-(point[0]<<shift),imag=after[1]-(point[1]<<shift);
    expect(event.defaultPrevented).toBeTrue();expect(component.view.zoom).toBe(1101);
    expect(real<=1n&&real>=-1n&&imag<=1n&&imag>=-1n).toBeTrue();
  });
  it('does not allow an invalid iteration budget to start a render',()=>{
    component.iterationBudget=-1;component.customIterations=NaN;component.changeSettings();expect(component.error).not.toBe('');component.zoomIn();expect(component.isDrawing).toBeFalse();expect(component.error).not.toBe('');
  });
});
