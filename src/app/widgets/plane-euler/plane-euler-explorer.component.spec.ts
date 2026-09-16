import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlaneEulerExplorerComponent } from './plane-euler-explorer.component';
import { PlanarityBoundComponent } from './planarity-bound.component';

describe('Laboratorios de Euler planar', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [PlaneEulerExplorerComponent, PlanarityBoundComponent] }).compileComponents(); });
  it('distingue una arista de ciclo de una arista puente y permite deshacer', () => {
    const fixture = TestBed.createComponent(PlaneEulerExplorerComponent), c = fixture.componentInstance;
    fixture.detectChanges(); c.toggle(0);
    expect(c.faceCount).toBe(4); expect(c.components).toBe(1);
    c.undo(); expect(c.faceCount).toBe(5);
    c.load('tree'); c.toggle(0);
    expect(c.faceCount).toBe(1); expect(c.components).toBe(2); expect(c.balance).toBe(3);
    fixture.destroy();
  });
  it('anima hasta un bosque y cancela la reproducción al cambiar de escenario', fakeAsync(() => {
    const fixture = TestBed.createComponent(PlaneEulerExplorerComponent), c = fixture.componentInstance;
    spyOnProperty(document, 'hidden', 'get').and.returnValue(false);
    c.load('mesh'); c.animateProof(); tick(12000);
    expect(c.edgeCount).toBe(8); expect(c.faceCount).toBe(1); expect(c.running).toBe(false);
    c.load('mesh'); c.animateProof(); c.load('islands'); tick(5000);
    expect(c.edgeCount).toBe(6); expect(c.components).toBe(5); expect(c.running).toBe(false);
    fixture.destroy();
  }));
  it('aplica la cota apropiada a K5 y K3,3 sin confundirla con una prueba de planaridad', () => {
    const fixture = TestBed.createComponent(PlanarityBoundComponent), c = fixture.componentInstance;
    fixture.detectChanges(); expect(c.edges).toBeGreaterThan(c.bound);
    c.preset(6,9,false); expect(c.edges).toBeLessThan(c.bound);
    c.bipartite = true; expect(c.edges).toBeGreaterThan(c.bound);
    c.preset(8,12,true); expect(c.edges).toBe(c.bound);
    fixture.destroy();
  });
});
