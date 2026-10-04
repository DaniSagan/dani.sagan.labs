import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SunPositionComponent } from './sun-position.component';
import { SunPositionCalculatorService, CelestialCoords } from 'src/app/shared/physics/sun-position-calculator-service.service';
import { GeolocationService } from 'src/app/shared/physics/geolocation.service';
import { throwError } from 'rxjs';

describe('SunPositionComponent', () => {
  let component: SunPositionComponent;
  let fixture: ComponentFixture<SunPositionComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SunPositionComponent], providers: [
      { provide: GeolocationService, useValue: { getCurrentPosition: () => throwError({code:1}) } },
    ] }).compileComponents();
    fixture = TestBed.createComponent(SunPositionComponent); component = fixture.componentInstance;
    fixture.detectChanges();
  });
  afterEach(() => fixture.destroy());
  it('validates inputs before calculating and reports location permission errors', async () => {
    component.latitude = 91; await component.calculateSunPosition();
    expect(component.error).toContain('Revisa'); expect(component.result).toBeNull();
    component.getGeolocation(); expect(component.locating).toBeFalse();
    expect(component.locationMessage).toContain('denegado');
  });
  it('renders all 366 days, keeps snapshots stable and applies the selected UTC offset', async () => {
    component.timeZoneMode = 'fixed'; component.year = 2024; component.date = '2024-02-29'; component.utcOffset = 2; component.orientation = 360;
    await component.calculateSunPosition(); fixture.detectChanges();
    expect(component.days.length).toBe(366); expect(component.days[365].date).toBe('2024-12-31');
    expect(component.canvas.nativeElement.height).toBe(422);
    expect(component.orientation).toBe(0); expect(component.date).toBe('2024-02-29');
    expect(component.progress).toBe(100); expect(component.calculating).toBeFalse();
    expect(component.bands.reduce((sum, band) => sum + band.duration, 0)).toBe(1440);
    component.time = '12:00'; component.updateInstant();
    const expected = TestBed.inject(SunPositionCalculatorService).getSunPosition(
      { latitude: component.latitude, longitude: component.longitude }, new Date('2024-02-29T10:00:00Z'));
    expect(component.elevation).toBeCloseTo(expected.elevation, 8);
    component.latitude = 10; expect(component.stale).toBeTrue();
    component.updateInstant(); expect(component.elevation).toBeCloseTo(expected.elevation, 8);
    component.changeDay(1); expect(component.date).toBe('2024-03-01');
    component.date = ''; component.updateDay(); expect(component.date).toBe('2024-03-01');
    expect(fixture.nativeElement.querySelectorAll('.legend span').length).toBe(4);
  });
  it('cancels an unfinished calculation and releases map resources on destruction', async () => {
    const pending = component.calculateSunPosition(); component.cancelCalculation(); await pending;
    expect(component.calculating).toBeFalse(); expect(component.result).toBeNull();
    const map = (component as any).map; const remove = spyOn(map, 'remove').and.callThrough();
    fixture.destroy(); expect(remove).toHaveBeenCalled();
  });
  it('calculates automatic civil time, reports gaps and distinguishes repeated hours', async () => {
    component.year = 2024; component.date = '2024-07-15'; component.time = '12:00';
    await component.calculateSunPosition();
    expect(component.result?.timeZone).toBe('Europe/Madrid');
    expect(component.offsetLabel).toBe('UTC+2:00');
    const solar = TestBed.inject(SunPositionCalculatorService);
    const summer = solar.getSunPosition({ latitude: component.latitude, longitude: component.longitude }, new Date('2024-07-15T10:00:00Z'));
    expect(component.elevation).toBeCloseTo(summer.elevation, 8);
    component.date = '2024-01-15'; component.updateDay(); expect(component.offsetLabel).toBe('UTC+1:00');
    component.date = '2024-03-31'; component.time = '02:30'; component.updateDay();
    expect(component.dayLength).toBe(1380); expect(component.elevation).toBeNull();
    expect(component.solarNoonOffsetLabel).toBe('UTC+2:00');
    expect(component.timeMessage).toContain('no existe');
    component.date = '2024-10-27'; component.updateDay();
    expect(component.dayLength).toBe(1500); expect(component.repeatedTime).toBeTrue();
    const first = component.elevation;
    component.timeOccurrence = 1; component.updateInstant();
    expect(component.offsetLabel).toBe('UTC+1:00'); expect(component.elevation).not.toBe(first);
    expect(component.stale).toBeFalse();
  });
  it('distinguishes night, opposite-facing sun, low sun and direct sun', () => {
    expect(component.kind(new CelestialCoords(-1, 180), 180)).toBe(0);
    expect(component.kind(new CelestialCoords(45, 0), 180)).toBe(1);
    expect(component.kind(new CelestialCoords(5, 180), 180)).toBe(2);
    expect(component.kind(new CelestialCoords(45, 180), 180)).toBe(3);
    component.orientation = 270; component.reverseOrientation(); expect(component.orientation).toBe(90);
  });
  it('shows the facade and perpendicular arrow and follows the orientation control', () => {
    const map = (component as any).map;
    const points = (index: number) => (component as any).facadeOverlay.getLayers()[index].getLatLngs()
      .map((point: any) => map.latLngToLayerPoint(point));
    component.orientation = 0; component.updateMapOrientation();
    let facade = points(0), normal = points(1);
    expect(facade[0].y).toBe(facade[1].y);
    expect(normal[0].x).toBe(normal[1].x);
    expect(normal[1].y).toBeLessThan(normal[0].y);
    const input = fixture.nativeElement.querySelector('[name=orientation]');
    input.value = '90'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    facade = points(0); normal = points(1);
    expect(facade[0].x).toBe(facade[1].x);
    expect(normal[0].y).toBe(normal[1].y);
    expect(normal[1].x).toBeGreaterThan(normal[0].x);
    map.setZoom(15); normal = points(1);
    expect(normal[0].distanceTo(normal[1])).toBeCloseTo(60, 0);
    map.fire('click', {latlng: {lat:41, lng:2}});
    expect(component.latitude).toBe(41); expect(component.longitude).toBe(2);
    expect((component as any).facadeOverlay.getLayers().length).toBe(3);
  });
});
