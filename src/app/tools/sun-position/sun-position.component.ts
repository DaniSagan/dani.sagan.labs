import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Vector2 } from 'src/app/mathematics/geometry/vector2';
import { GeolocationService } from 'src/app/shared/physics/geolocation.service';
import { CelestialCoords, GeographicCoords, SunPositionCalculatorService } from 'src/app/shared/physics/sun-position-calculator-service.service';

@Component({
  selector: 'app-sun-position',
  templateUrl: './sun-position.component.html',
  styleUrls: ['./sun-position.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SunPositionComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

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

  constructor(
    private sunPositionCalculatorService: SunPositionCalculatorService,
    private geolocationService: GeolocationService) {
  }

  ngOnInit() {
    const date = new Date();
    this.year = date.getFullYear();
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

          if(minute === 0) {
            ctx.fillStyle = 'red';
            ctx.fillRect((hour * 60 + minute) * this.minuteWidth, day * this.dayHeight, 1, this.dayHeight);
          }

          if(date.getDate() === 1) {
            ctx.fillStyle = 'red';
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
}

export class GeolocatedSunPosition {
  coords?: GeographicCoords;
  date?: Date;
  sunPosition?: CelestialCoords;
}
