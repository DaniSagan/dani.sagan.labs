import { TestBed } from '@angular/core/testing';
import { BrachistochroneRaceComponent } from './brachistochrone-race.component';
import { CycloidConstructionComponent } from './cycloid-construction.component';
import { TautochroneExplorerComponent } from './tautochrone-explorer.component';

describe('Brachistochrone laboratories', () => {
  it('updates race geometry through a range control and resets the clock', async () => {
    await TestBed.configureTestingModule({ imports: [BrachistochroneRaceComponent] }).compileComponents();
    const fixture = TestBed.createComponent(BrachistochroneRaceComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.elapsed = 0.5;
    const slider: HTMLInputElement = fixture.nativeElement.querySelector('input');
    slider.value = '9';
    slider.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.distance).toBe(9);
    expect(fixture.componentInstance.elapsed).toBe(0);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(3);
    const last = fixture.componentInstance.tracks[0].points[600];
    expect(last.x).toBeCloseTo(9, 8);
    fixture.destroy();
  });
  it('cancels a running race when the component is destroyed', () => {
    const component = new BrachistochroneRaceComponent();
    const cancel = spyOn(window, 'cancelAnimationFrame');
    spyOn(window, 'requestAnimationFrame').and.returnValue(42);
    component.toggle();
    expect(component.playing).toBe(true);
    component.ngOnDestroy();
    expect(cancel).toHaveBeenCalledWith(42);
    expect(component.playing).toBe(false);
  });
  it('renders the construction at the bottom and at a full turn', async () => {
    await TestBed.configureTestingModule({ imports: [CycloidConstructionComponent] }).compileComponents();
    const fixture = TestBed.createComponent(CycloidConstructionComponent);
    fixture.componentInstance.theta = Math.PI;
    fixture.detectChanges();
    expect(fixture.componentInstance.point.y).toBeCloseTo(2, 10);
    fixture.componentInstance.theta = 2 * Math.PI;
    fixture.detectChanges();
    expect(fixture.componentInstance.point.x).toBeCloseTo(2 * Math.PI, 10);
    fixture.destroy();
  });
  it('shows simultaneous arrival and resets after changing the radius', async () => {
    await TestBed.configureTestingModule({ imports: [TautochroneExplorerComponent] }).compileComponents();
    const fixture = TestBed.createComponent(TautochroneExplorerComponent);
    fixture.componentInstance.seek(1);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('¡Llegada simultánea!');
    const points = fixture.componentInstance.starts.map(s => fixture.componentInstance.point(s));
    expect(points[0].x).toBeCloseTo(points[2].x, 10);
    fixture.componentInstance.reset();
    expect(fixture.componentInstance.phase).toBe(0);
    fixture.destroy();
  });
});
