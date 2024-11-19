import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Vector2 } from 'src/app/mathematics/geometry/vector2';
import { GeolocationService } from 'src/app/shared/physics/geolocation.service';
import { CelestialCoords, GeographicCoords, SunPositionCalculatorService } from 'src/app/shared/physics/sun-position-calculator-service.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-sun-position',
  templateUrl: './sun-position.component.html',
  styleUrls: ['./sun-position.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SunPositionComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  //@ViewChild('map', { static: true }) map!: ElementRef<HTMLCanvasElement>;

  latitude: number = 0;
  longitude: number = 0;
  date: string = new Date().toISOString().substring(0, 10);
  time: string = "12:00";
  elevation: number | null = null;
  azimuth: number | null = null;
  orientation: number | null = null;
  year: number | null = null;

  dayHeight: number = 2;
  minuteWidth: number = 1;
  width: number = 24*60*this.minuteWidth;
  height: number = 365*this.dayHeight;

  private map!: L.Map;
  private markers: L.Marker[] = [];
  private line: L.Polyline | null = null;
  angle: number | null = null;

  constructor(
    private sunPositionCalculatorService: SunPositionCalculatorService,
    private geolocationService: GeolocationService,
    private elementRef: ElementRef) {
  }

  ngOnInit() {
    const date = new Date();
    this.year = date.getFullYear();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  calculateSunPosition(): void {
    if(this.year === null || this.orientation === null) return;
    const coords = new GeographicCoords(this.latitude, this.longitude);
    this.draw(coords, this.year, this.orientation);
  }

  getGeolocation() {
    this.geolocationService.getCurrentPosition().subscribe({
      next: (position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.map.flyTo([this.latitude, this.longitude], 19);
      },
      error: (error) => {
        console.error('Error getting geolocation:', error);
      },
    });
  }

  getSunPositionsForDay(coord: GeographicCoords, date: Date): GeolocatedSunPosition[] {
    let res: GeolocatedSunPosition[] = [];
    for(let h: number = 0; h < 24; h++) {
      for(let m: number = 0; m < 60; m++){
        let dateTime: Date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0);
        let sunPosition: CelestialCoords = this.sunPositionCalculatorService.getSunPosition(coord, dateTime);
        res.push({coords: coord, date: dateTime, sunPosition: sunPosition});
      }
    }
    return res;
  }

  draw(coords: GeographicCoords, year: number, azimuthNormal: number) {
    const canvas = this.canvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let date = new Date(year, 0, 1);
    let day = 0;
    while(date.getFullYear() == year) {
      for(let hour: number = 0; hour < 24; hour++)
      {
        for(let minute: number = 0; minute < 60; minute++)
        {
          let dateTime = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute, 0);
          let sunPosition: CelestialCoords = this.sunPositionCalculatorService.getSunPosition(coords, dateTime);

          ctx.fillStyle = this.getColor(sunPosition, azimuthNormal);
          ctx.fillRect((hour * 60 + minute) * this.minuteWidth, day * this.dayHeight, this.minuteWidth, this.dayHeight);

          let hourFillStyle = this.getHourFillStyle(hour, minute);
          if(hourFillStyle !== null) {
            ctx.fillStyle = hourFillStyle;
            ctx.fillRect((hour * 60 + minute) * this.minuteWidth, day * this.dayHeight, 1, this.dayHeight);
          }

          if(date.getDate() === 1) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect((hour * 60 + minute) * this.minuteWidth, day * this.dayHeight, this.minuteWidth, 1);
          }
        }
      }

      let newDate = new Date(date.valueOf());
      date.setDate(newDate.getDate() + 1);
      day++;
    }


  }

  getColor(celestialCoords: CelestialCoords, azimuthHeading: number): string | CanvasGradient | CanvasPattern {
    if (celestialCoords.elevation < 0) {
      return 'black';
    }

    let normal = new Vector2(Math.cos(azimuthHeading * Math.PI / 180), Math.sin(azimuthHeading * Math.PI / 180));
    let sunNormal = new Vector2(Math.cos(celestialCoords.azimuth * Math.PI / 180), Math.sin(celestialCoords.azimuth * Math.PI / 180));

    let p = normal.x * sunNormal.x + normal.y * sunNormal.y;

    if(p < 0) {
      return 'lightblue';
    }

    if(celestialCoords.elevation < 10) return 'orange';
    return 'yellow';
  }

  getHourFillStyle(hour: number, minute: number): string | CanvasGradient | CanvasPattern | null {
    if(minute !== 0) return null;
    if(hour % 6 === 0) return '#ff0000';
    if(hour % 3 === 0) return '#555555';
    return '#111111';
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', this.onMapClick.bind(this));
  }

  private onMapClick(e: L.LeafletMouseEvent): void {
    if (this.markers.length >= 2) {
      // Eliminar marcadores y línea previos si ya hay dos puntos
      this.clearMarkersAndLine();
    }

    const marker = L.marker(e.latlng).addTo(this.map);
    this.markers.push(marker);

    if (this.markers.length === 2) {
      // Calcular el ángulo entre los dos puntos cuando haya dos marcadores
      this.calculateAngle();
      // Dibujar línea entre los dos puntos
      this.line = L.polyline([this.markers[0].getLatLng(), this.markers[1].getLatLng()], { color: 'blue' }).addTo(this.map);
    }
  }

  private calculateAngle(): void {
    const [pointA, pointB] = this.markers.map(marker => marker.getLatLng());

    // Convertir latitudes y longitudes a radianes
    const lat1 = pointA.lat * (Math.PI / 180);
    const lat2 = pointB.lat * (Math.PI / 180);
    const deltaLon = (pointB.lng - pointA.lng) * (Math.PI / 180);

    // Cálculo del ángulo usando fórmula de navegación
    const y = Math.sin(deltaLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
    const bearing = Math.atan2(y, x);

    // Convertir de radianes a grados y ajustar el ángulo al rango 0-360
    this.angle = (bearing * (180 / Math.PI) + 360) % 360;

    this.latitude = pointA.lat;
    this.longitude = pointA.lng;
    this.orientation = this.angle + 90;
  }

  private clearMarkersAndLine(): void {
    this.markers.forEach(marker => this.map.removeLayer(marker));
    this.markers = [];
    this.angle = null;
    if(this.line !== null)
    {
      this.map.removeLayer(this.line);
    }
  }
}

export class GeolocatedSunPosition {
  coords?: GeographicCoords;
  date?: Date;
  sunPosition?: CelestialCoords;
}
