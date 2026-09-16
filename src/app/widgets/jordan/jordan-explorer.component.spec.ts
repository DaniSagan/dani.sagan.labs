import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { JordanExplorerComponent } from './jordan-explorer.component';
import { JordanHypothesesComponent } from './jordan-hypotheses.component';

describe('Laboratorios de Jordan',()=>{
  beforeEach(async()=>{await TestBed.configureTestingModule({imports:[JordanExplorerComponent,JordanHypothesesComponent]}).compileComponents();});
  it('actualiza la pertenencia al cambiar la curva y distingue la frontera',()=>{
    const fixture=TestBed.createComponent(JordanExplorerComponent),c=fixture.componentInstance;
    fixture.detectChanges();expect(c.result.location).toBe('inside');
    c.preset('bay');expect(c.result.location).toBe('outside');
    c.onBoundary();expect(c.result.location).toBe('boundary');
    c.moveKeyboard(new KeyboardEvent('keydown',{key:'ArrowRight'}));expect(c.point.x).toBe(155);
    fixture.destroy();
  });
  it('detiene el barrido al editar o destruir el componente',fakeAsync(()=>{
    const fixture=TestBed.createComponent(JordanExplorerComponent),c=fixture.componentInstance;
    spyOnProperty(document,'hidden','get').and.returnValue(false);
    c.animate();tick(500);expect(c.point.x).not.toBe(370);
    c.manual();const x=c.point.x;tick(1000);expect(c.point.x).toBe(x);expect(c.playing).toBe(false);
    c.animate();fixture.destroy();tick(1000);expect(c.playing).toBe(false);
  }));
  it('distingue una apertura positiva del arco cerrado y los ejemplos con tres regiones',()=>{
    const fixture=TestBed.createComponent(JordanHypothesesComponent),c=fixture.componentInstance;
    fixture.detectChanges();expect(c.components).toBe(2);
    c.select('open');expect(c.components).toBe(1);
    c.gap=0;c.updateArc();expect(c.components).toBe(2);
    c.gap=1;c.updateArc();expect(c.components).toBe(1);
    c.select('eight');expect(c.components).toBe(3);
    c.select('two');expect(c.components).toBe(3);
    fixture.destroy();
  });
});
