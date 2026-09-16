import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { KonigsbergExplorerComponent } from './konigsberg-explorer.component';

describe('Laboratorio de Königsberg', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [KonigsbergExplorerComponent] }).compileComponents(); });

  it('impide saltar entre regiones o reutilizar puentes y permite deshacer', fakeAsync(() => {
    const fixture = TestBed.createComponent(KonigsbergExplorerComponent);
    const c = fixture.componentInstance;
    fixture.detectChanges();
    c.chooseRegion(0);
    c.clickBridge(c.bridges[5]);
    expect(c.steps).toEqual([]);
    c.clickBridge(c.bridges[0]); tick(700);
    expect(c.current).toBe(1);
    c.clickBridge(c.bridges[0]);
    expect(c.steps).toEqual([1]);
    c.undo();
    expect(c.current).toBe(0);
    expect(c.steps).toEqual([]);
    fixture.destroy();
  }));
  it('reproduce un circuito completo y cancela la animación al cambiar escenario', fakeAsync(() => {
    const fixture = TestBed.createComponent(KonigsbergExplorerComponent);
    const c = fixture.componentInstance;
    c.load('circuit'); c.solve(); tick(10100);
    expect(c.complete).toBe(true);
    expect(c.current).toBe(c.start);
    expect(c.auto).toBe(false);
    c.solve(); tick(1200); c.load('original'); tick(2000);
    expect(c.steps).toEqual([]);
    expect(c.auto).toBe(false);
    expect(c.moving).toBe(false);
    fixture.destroy();
  }));
  it('actualiza conectividad y paridad al editar y reinicia el paseo', () => {
    const fixture = TestBed.createComponent(KonigsbergExplorerComponent);
    const c = fixture.componentInstance;
    c.chooseRegion(0); c.toggleBridge(c.bridges[0]);
    expect(c.current).toBeNull();
    expect(c.analysis.odd).toEqual([2, 3]);
    c.load('disconnected');
    expect(c.analysis.connected).toBe(false);
    expect(c.analysis.odd).toEqual([]);
    c.addBridge(0, 2);
    expect(c.analysis.kind).toBe('open');
    fixture.destroy();
  });
});
