import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HarmonicAreaComponent } from './harmonic-area.component';
import { GammaConvergenceComponent } from './gamma-convergence.component';

describe('Laboratorios de Euler–Mascheroni',()=>{
  beforeEach(async()=>{await TestBed.configureTestingModule({imports:[HarmonicAreaComponent,GammaConvergenceComponent]}).compileComponents();});
  it('mantiene la selección dentro del número de rectángulos y actualiza las áreas',()=>{
    const fixture=TestBed.createComponent(HarmonicAreaComponent),c=fixture.componentInstance;
    fixture.detectChanges();c.selected=8;c.setN(1);
    expect(c.selected).toBe(1);expect(c.bars.length).toBe(1);expect(c.lower).toBeCloseTo(1-Math.log(2),14);
    fixture.destroy();
  });
  it('termina la animación y cancela el temporizador al destruir el widget',fakeAsync(()=>{
    const fixture=TestBed.createComponent(HarmonicAreaComponent),c=fixture.componentInstance;
    spyOnProperty(document,'hidden','get').and.returnValue(false);
    c.setN(39);c.animate();tick(1000);expect(c.n).toBe(40);expect(c.playing).toBe(false);
    c.animate();expect(c.n).toBe(1);fixture.destroy();tick(1000);expect(c.n).toBe(1);expect(c.playing).toBe(false);
  }));
  it('conserva el cálculo válido frente a entradas incorrectas y acepta ambos extremos',()=>{
    const fixture=TestBed.createComponent(GammaConvergenceComponent),c=fixture.componentInstance;
    fixture.detectChanges();
    for(const input of [null,0,1.5,100001]){c.inputN=input;c.fromInput();expect(c.error).not.toBe('');expect(c.n).toBe(10);}
    c.preset(100000);expect(c.error).toBe('');expect(c.n).toBe(100000);
    c.exponent=0;c.fromSlider();expect(c.n).toBe(1);
    expect(c.paths.every(p=>!p.includes('NaN')&&!p.includes('Infinity'))).toBe(true);
    expect(c.formatError(0)).toContain('límite numérico');fixture.destroy();
  });
});
