import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';
import { GeolocationService } from 'src/app/shared/physics/geolocation.service';
import { CelestialCoords, GeographicCoords, SunPositionCalculatorService } from 'src/app/shared/physics/sun-position-calculator-service.service';
import { CivilDay, SolarTimeService } from './solar-time.service';
import { facadeAngle, facadeTrajectory } from './solar-facade-path';

type Settings = { latitude: number; longitude: number; orientation: number; year: number; utcOffset: number; timeZone: string | null; timeZoneMode: 'automatic' | 'zone' | 'fixed' };
type SolarDay = { date: string; daylight: number; direct: number };
type Band = { start: number; duration: number; kind: number };
const PALETTE = ['#101521', '#486883', '#ef9650', '#f8d56e', '#7c677f'];
const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Component({
  selector: 'app-sun-position', standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sun-position.component.html', styleUrls: ['./sun-position.component.css'],
})
export class SunPositionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('map', { static: true }) mapElement!: ElementRef<HTMLDivElement>;
  latitude = 40.4168;
  longitude = -3.7038;
  orientation = 180;
  year = new Date().getFullYear();
  utcOffset = -new Date().getTimezoneOffset() / 60;
  timeZoneMode: 'automatic' | 'zone' | 'fixed' = 'automatic';
  timeZone = 'Europe/Madrid';
  readonly timeZones = (Intl as typeof Intl & { supportedValuesOf?: (key: string) => string[] }).supportedValuesOf?.('timeZone')
    ?? ['Europe/Madrid', 'Atlantic/Canary', 'Europe/London', 'America/New_York', 'America/Argentina/Buenos_Aires', 'Asia/Tokyo', 'Australia/Sydney', 'UTC'];
  dayLength = 1440;
  timeOccurrence = 0;
  timeMessage = '';
  private civilDay?: CivilDay;
  date = this.localDate(new Date());
  time = '12:00';
  elevation: number | null = null;
  azimuth: number | null = null;
  angle: number | null = null;
  mapMode: 'location' | 'direction' = 'location';
  locating = false;
  calculating = false;
  progress = 0;
  error = '';
  locationMessage = '';
  result: Settings | null = null;
  days: SolarDay[] = [];
  bands: Band[] = [];
  altitudePath = '';
  facadeDayPath = '';
  facadeNightPath = '';
  facadeLabels: { x: number; y: number; minute: number }[] = [];
  readonly horizontalAngles = [-180, -135, -90, -45, 0, 45, 90, 135, 180];
  readonly verticalAngles = [-90, -60, -30, 0, 30, 60, 90];
  sunrise: number | null = null;
  sunset: number | null = null;
  solarNoon = 0;
  maxElevation = 0;
  selectedDay = 0;
  selectedMinute = 720;
  daylight = 0;
  direct = 0;
  averageDaylight = 0;
  averageDirect = 0;
  readonly palette = PALETTE;
  readonly hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];
  readonly width = 816;
  height = 422;
  readonly plotLeft = 48;
  readonly plotTop = 26;
  readonly plotWidth = 744;
  hover = '';
  private map?: L.Map;
  private locationMarker?: L.CircleMarker;
  private directionMarkers: L.CircleMarker[] = [];
  private line?: L.Polyline;
  private locationSubscription?: Subscription;
  private run = 0;
  private resize?: ResizeObserver;
  private image?: ImageData;
  private readonly samples = 288;

  constructor(private solar: SunPositionCalculatorService, private geolocation: GeolocationService, private solarTime: SolarTimeService) {}

  ngAfterViewInit(): void {
    this.map = L.map(this.mapElement.nativeElement, { center: [this.latitude, this.longitude], zoom: 6 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(this.map);
    this.map.on('click', event => this.onMapClick(event));
    this.resize = new ResizeObserver(() => this.map?.invalidateSize());
    this.resize.observe(this.mapElement.nativeElement);
    this.syncMap();
  }
  ngOnDestroy(): void {
    this.run++;
    this.locationSubscription?.unsubscribe();
    this.resize?.disconnect();
    this.map?.remove();
  }
  get stale(): boolean {
    return !!this.result && (['latitude', 'longitude', 'orientation', 'year', 'timeZoneMode'].some(key => this[key as keyof Settings] !== this.result![key as keyof Settings])
      || (this.timeZoneMode === 'fixed' ? this.utcOffset !== this.result.utcOffset : this.timeZone !== this.result.timeZone));
  }
  get offsetLabel(): string {
    if (this.result?.timeZone) {
      const timestamp = this.civilDay?.slots[this.selectedMinute]?.[this.timeOccurrence];
      return timestamp !== undefined ? this.solarTime.formatOffset(this.solarTime.offsetAt(timestamp, this.result.timeZone))
        : (this.civilDay?.offsets.map(offset => this.solarTime.formatOffset(offset)).join(' / ') || this.result.timeZone);
    }
    return this.solarTime.formatOffset((this.result?.utcOffset ?? this.utcOffset) * 60);
  }
  get calendarZoneLabel(): string { return this.result?.timeZone ?? this.offsetLabel; }
  get solarNoonOffsetLabel(): string {
    const timestamp = this.civilDay?.slots[this.solarNoon]?.[0];
    return this.result?.timeZone && timestamp !== undefined
      ? this.solarTime.formatOffset(this.solarTime.offsetAt(timestamp, this.result.timeZone)) : this.offsetLabel;
  }
  get repeatedTime(): boolean { return (this.civilDay?.slots[this.selectedMinute]?.length ?? 0) > 1; }
  get dateLabel(): string {
    return new Date(this.date + 'T12:00:00Z').toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
  }
  get sunX(): number { return 100 + 66 * Math.sin((this.azimuth ?? 0) * Math.PI / 180); }
  get relativeSunAngle(): number { return facadeAngle(this.azimuth ?? 0, this.result?.orientation ?? this.orientation); }
  get facadeSunX(): number { return (this.relativeSunAngle + 180) * 2; }
  get facadeSunY(): number { return 20 + (90 - (this.elevation ?? 0)) * 2; }
  get sunY(): number { return 100 - 66 * Math.cos((this.azimuth ?? 0) * Math.PI / 180); }
  get normalX(): number { return 100 + 54 * Math.sin((this.result?.orientation ?? 180) * Math.PI / 180); }
  get normalY(): number { return 100 - 54 * Math.cos((this.result?.orientation ?? 180) * Math.PI / 180); }

  async calculateSunPosition(): Promise<void> {
    const config: Settings = { latitude: this.latitude, longitude: this.longitude, orientation: this.orientation, year: this.year, utcOffset: this.utcOffset, timeZoneMode: this.timeZoneMode, timeZone: this.timeZoneMode === 'fixed' ? null : this.timeZone };
    if (![config.latitude, config.longitude, config.orientation, config.year].every(v => typeof v === 'number' && Number.isFinite(v)) || Math.abs(config.latitude) > 90 || Math.abs(config.longitude) > 180
      || config.orientation < 0 || config.orientation > 360 || !Number.isInteger(config.year) || config.year < 1900 || config.year > 2100
      || (config.timeZoneMode === 'fixed' && (!Number.isFinite(config.utcOffset) || config.utcOffset < -12 || config.utcOffset > 14 || !Number.isInteger(config.utcOffset * 4)))) {
      this.error = 'Revisa las coordenadas, la orientación (0–360°), el año (1900–2100) y el huso horario (intervalos de 15 minutos).';
      return;
    }
    try {
      if (config.timeZoneMode === 'automatic') config.timeZone = this.solarTime.detectZone(config.latitude, config.longitude);
      if (config.timeZone) this.solarTime.offsetAt(Date.now(), config.timeZone);
      else if (config.timeZoneMode !== 'fixed') throw new Error('Missing zone');
      if (config.timeZone) this.timeZone = config.timeZone;
    } catch { this.error = 'No se pudo determinar la zona horaria. Selecciona una zona válida o utiliza un huso fijo.'; return; }
    config.orientation %= 360;
    this.orientation = config.orientation;
    const run = ++this.run;
    this.calculating = true; this.progress = 0; this.error = ''; this.hover = '';
    const start = Date.UTC(config.year, 0, 1);
    const count = Math.round((Date.UTC(config.year + 1, 0, 1) - start) / 86400000);
    const image = new ImageData(this.samples, count);
    const colors = [[16, 21, 33], [72, 104, 131], [239, 150, 80], [248, 213, 110], [124, 103, 127]];
    const days: SolarDay[] = [];
    const coords = new GeographicCoords(config.latitude, config.longitude);
    try {
      for (let day = 0; day < count; day++) {
        if (run !== this.run) return;
        let daylight = 0, direct = 0;
        const date = new Date(start + day * 86400000).toISOString().slice(0, 10);
        const civil = this.solarTime.day(date, config.timeZone, config.utcOffset, 5);
        for (let sample = 0; sample < this.samples; sample++) {
          let kind = 4;
          civil.slots[sample].forEach((timestamp, occurrence) => {
            const position = this.solar.getSunPosition(coords, new Date(timestamp + 2.5 * 60000));
            const value = this.kind(position, config.orientation);
            if (occurrence === 0) kind = value;
            if (value > 0) daylight += 5;
            if (value > 1) direct += 5;
          });
          const pixel = (day * this.samples + sample) * 4;
          image.data.set([...colors[kind], 255], pixel);
        }
        days.push({ date, daylight, direct });
        this.progress = Math.round((day + 1) / count * 100);
        if (day % 7 === 0) await new Promise(resolve => setTimeout(resolve, 0));
      }
      if (run !== this.run) return;
      this.result = config; this.days = days; this.image = image;
      this.averageDaylight = days.reduce((sum, d) => sum + d.daylight, 0) / count;
      this.averageDirect = days.reduce((sum, d) => sum + d.direct, 0) / count;
      const candidate = `${config.year}${this.date.slice(4)}`;
      this.date = days.some(d => d.date === candidate) ? candidate : days[0].date;
      this.height = count + 56;
      this.canvas.nativeElement.height = this.height;
      this.updateDay();
    } catch {
      this.error = 'No se pudo completar el cálculo. Revisa los datos e inténtalo de nuevo.';
    } finally {
      if (run === this.run) this.calculating = false;
    }
  }
  cancelCalculation(): void { this.run++; this.calculating = false; }

  kind(position: CelestialCoords, orientation: number): number {
    if (position.elevation <= 0) return 0;
    if (Math.cos((position.azimuth - orientation) * Math.PI / 180) <= 0) return 1;
    return position.elevation < 10 ? 2 : 3;
  }
  getColor(position: CelestialCoords, orientation: number): string { return PALETTE[this.kind(position, orientation)]; }
  formatTime(minute: number | null): string {
    if (minute === null) return '—';
    return `${String(Math.floor(minute / 60)).padStart(2, '0')}:${String(Math.floor(minute % 60)).padStart(2, '0')}`;
  }
  duration(minutes: number): string {
    const rounded = Math.round(minutes);
    return `${Math.floor(rounded / 60)} h ${String(rounded % 60).padStart(2, '0')} min`;
  }
  updateDay(): void {
    if (!this.result) return;
    const day = this.days.findIndex(d => d.date === this.date);
    if (day < 0) { this.date = this.days[this.selectedDay].date; return; }
    this.selectedDay = day;
    const config = this.result;
    this.civilDay = this.solarTime.day(this.date, config.timeZone, config.utcOffset);
    this.dayLength = this.civilDay.lengthMinutes;
    this.timeOccurrence = 0;
    const coords = new GeographicCoords(config.latitude, config.longitude);
    const bands: Band[] = [], points: string[] = [];
    this.daylight = 0; this.direct = 0; this.sunrise = null; this.sunset = null;
    this.maxElevation = -90;
    const positions = new Map<number, CelestialCoords>();
    let previousElevation: number | undefined;
    for (const entry of this.civilDay.occurrences) {
      const position = this.solar.getSunPosition(coords, new Date(entry.timestamp));
      positions.set(entry.timestamp, position);
      const kind = this.kind(position, config.orientation);
      if (kind > 0) this.daylight++;
      if (kind > 1) this.direct++;
      if (previousElevation === undefined) previousElevation = this.solar.getSunPosition(coords, new Date(entry.timestamp - 60000)).elevation;
      if (position.elevation > 0 && previousElevation <= 0) this.sunrise = entry.minute;
      if (position.elevation <= 0 && previousElevation > 0) this.sunset = entry.minute;
      previousElevation = position.elevation;
      if (position.elevation > this.maxElevation) { this.maxElevation = position.elevation; this.solarNoon = entry.minute; }
    }
    let penDown = false;
    for (let minute = 0; minute < 1440; minute++) {
      const timestamp = this.civilDay.slots[minute][0];
      const position = timestamp === undefined ? undefined : positions.get(timestamp);
      const kind = position ? this.kind(position, config.orientation) : 4;
      const last = bands[bands.length - 1];
      if (last?.kind === kind) last.duration++; else bands.push({ start: minute, duration: 1, kind });
      if (!position) { penDown = false; continue; }
      if (minute % 5 === 0 || minute === 1439) {
        points.push((penDown ? 'L' : 'M') + (minute / 1440 * 720).toFixed(1) + ',' + (110 - position.elevation).toFixed(1));
        penDown = true;
      }
    }
    this.bands = bands; this.altitudePath = points.join(' ');
    const trajectory = facadeTrajectory(this.civilDay.occurrences.map(entry => ({ position: positions.get(entry.timestamp)!, minute: entry.minute })), config.orientation);
    this.facadeDayPath = trajectory.daylight; this.facadeNightPath = trajectory.night; this.facadeLabels = trajectory.labels;
    this.updateInstant(); this.paintCalendar();
  }
  changeDay(delta: number): void {
    const day = this.days[this.selectedDay + delta];
    if (day) { this.date = day.date; this.updateDay(); }
  }
  selectMinute(minute: number): void {
    if (!Number.isFinite(minute)) return;
    this.time = this.formatTime(Math.max(0, Math.min(1439, Math.round(minute))));
    this.updateInstant();
  }
  updateInstant(): void {
    if (!this.result || !/^\d{2}:\d{2}$/.test(this.time)) return;
    const [h, m] = this.time.split(':').map(Number);
    if (h > 23 || m > 59) return;
    this.selectedMinute = h * 60 + m;
    const timestamps = this.civilDay?.slots[this.selectedMinute] ?? [];
    if (timestamps.length <= 1) this.timeOccurrence = 0;
    const timestamp = timestamps[this.timeOccurrence] ?? timestamps[0];
    if (timestamp === undefined) {
      this.elevation = null; this.azimuth = null;
      this.timeMessage = 'Esta hora no existe en esta fecha: el reloj se adelanta por el cambio de horario.';
      return;
    }
    this.timeMessage = timestamps.length > 1 ? 'Esta hora ocurre dos veces. Elige la primera o la segunda.' : '';
    const position = this.solar.getSunPosition(new GeographicCoords(this.result.latitude, this.result.longitude), new Date(timestamp));
    this.elevation = position.elevation; this.azimuth = position.azimuth;
  }
  private paintCalendar(): void {
    if (!this.image || !this.result) return;
    const canvas = this.canvas.nativeElement, ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#10131d'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const buffer = document.createElement('canvas');
    buffer.width = this.samples; buffer.height = this.days.length;
    buffer.getContext('2d')!.putImageData(this.image, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(buffer, this.plotLeft, this.plotTop, this.plotWidth, this.days.length);
    ctx.font = '12px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#d8e2f2';
    for (const hour of this.hours) {
      const x = this.plotLeft + hour / 24 * this.plotWidth;
      ctx.fillText(String(hour).padStart(2, '0') + ':00', x, 16);
      ctx.strokeStyle = '#ffffff22'; ctx.beginPath(); ctx.moveTo(x, this.plotTop); ctx.lineTo(x, this.plotTop + this.days.length); ctx.stroke();
    }
    ctx.textAlign = 'right';
    for (let month = 0; month < 12; month++) {
      const day = (Date.UTC(this.result.year, month, 1) - Date.UTC(this.result.year, 0, 1)) / 86400000;
      const y = this.plotTop + day;
      ctx.fillStyle = '#d8e2f2'; ctx.fillText(MONTHS[month], this.plotLeft - 8, y + 12);
      ctx.strokeStyle = '#ffffff33'; ctx.beginPath(); ctx.moveTo(this.plotLeft, y); ctx.lineTo(this.plotLeft + this.plotWidth, y); ctx.stroke();
    }
    ctx.strokeStyle = '#ff785d'; ctx.lineWidth = 2;
    ctx.strokeRect(this.plotLeft, this.plotTop + this.selectedDay, this.plotWidth, 1);
    ctx.fillStyle = '#d8e2f2'; ctx.textAlign = 'center';
    ctx.fillText('Hora local · ' + this.calendarZoneLabel, this.plotLeft + this.plotWidth / 2, canvas.height - 9);
  }
  calendarPointer(event: PointerEvent, select = false): void {
    if (!this.result) return;
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = (event.clientX - rect.left) * this.width / rect.width - this.plotLeft;
    const y = (event.clientY - rect.top) * this.height / rect.height - this.plotTop;
    if (x < 0 || x >= this.plotWidth || y < 0 || y >= this.days.length) { this.hover = ''; return; }
    const day = Math.floor(y), minute = Math.min(1439, Math.floor(x / this.plotWidth * 1440));
    const date = this.days[day].date;
    const civil = date === this.date && this.civilDay ? this.civilDay : this.solarTime.day(date, this.result.timeZone, this.result.utcOffset);
    const timestamps = civil.slots[minute];
    const timestamp = timestamps[0];
    if (timestamp === undefined) this.hover = date + ' · ' + this.formatTime(minute) + ' · Hora inexistente por cambio de horario';
    else {
      const position = this.solar.getSunPosition(new GeographicCoords(this.result.latitude, this.result.longitude), new Date(timestamp));
      this.hover = date + ' · ' + this.formatTime(minute) + ' · Elevación ' + position.elevation.toFixed(1) + '° · Azimut ' + position.azimuth.toFixed(1) + '°' + (timestamps.length > 1 ? ' · Hora repetida (primera)' : '');
    }
    if (select) { this.date = date; this.time = this.formatTime(minute); this.updateDay(); }
  }
  exportPng(): void {
    if (!this.result) return;
    const exportCanvas = document.createElement('canvas'); exportCanvas.width = this.width; exportCanvas.height = this.height + 116;
    const ctx = exportCanvas.getContext('2d')!;
    ctx.fillStyle = '#10131d'; ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    ctx.fillStyle = '#d8e2f2'; ctx.font = '14px monospace';
    ctx.fillText(`Sol · ${this.result.year} · ${this.result.latitude.toFixed(4)}, ${this.result.longitude.toFixed(4)} · ${this.result.orientation}° · ${this.calendarZoneLabel}`, 20, 25);
    ctx.drawImage(this.canvas.nativeElement, 0, 40);
    ['Noche', 'Sol detrás', 'Sol bajo (<10°)', 'Sol de frente'].forEach((label, i) => {
      ctx.fillStyle = PALETTE[i]; ctx.fillRect(20 + i * 195, this.height + 58, 12, 12);
      ctx.fillStyle = '#d8e2f2'; ctx.fillText(label, 38 + i * 195, this.height + 69);
    });
    if (this.result.timeZone) {
      ctx.fillStyle = PALETTE[4]; ctx.fillRect(20, this.height + 88, 12, 12);
      ctx.fillStyle = '#d8e2f2'; ctx.font = '12px monospace';
      ctx.fillText('Hora inexistente · Horas repetidas: se representa la primera vez', 38, this.height + 99);
    }
    const link = document.createElement('a'); link.download = `horas-sol-${this.result.year}.png`; link.href = exportCanvas.toDataURL('image/png'); link.click();
  }
  getGeolocation(): void {
    this.locating = true; this.locationMessage = '';
    this.locationSubscription?.unsubscribe();
    this.locationSubscription = this.geolocation.getCurrentPosition().subscribe({
      next: position => {
        this.latitude = Number(position.coords.latitude.toFixed(6)); this.longitude = Number(position.coords.longitude.toFixed(6));
        this.locating = false; this.syncMap(15); this.locationMessage = 'Ubicación actualizada. Recalcula para ver sus horas de sol.';
      },
      error: error => { this.locating = false; this.locationMessage = error?.code === 1 ? 'Permiso de ubicación denegado. Puedes indicar las coordenadas o usar el mapa.' : 'No se pudo obtener la ubicación. Puedes seleccionarla en el mapa.'; },
    });
  }
  syncMap(zoom?: number): void {
    if (!this.map || !Number.isFinite(this.latitude) || !Number.isFinite(this.longitude) || Math.abs(this.latitude) > 90 || Math.abs(this.longitude) > 180) return;
    this.detectTimeZone();
    this.clearDirection();
    this.locationMarker?.remove();
    this.locationMarker = L.circleMarker([this.latitude, this.longitude], { radius: 7, color: '#ff785d', fillOpacity: 1 }).addTo(this.map);
    if (zoom) this.map.setView([this.latitude, this.longitude], zoom);
  }
  private onMapClick(event: L.LeafletMouseEvent): void {
    if (!this.map) return;
    if (this.mapMode === 'location') {
      this.latitude = Number(event.latlng.lat.toFixed(6)); this.longitude = Number(((((event.latlng.lng + 180) % 360 + 360) % 360) - 180).toFixed(6));
      this.syncMap(); return;
    }
    if (this.directionMarkers.length === 2) this.clearDirection();
    this.directionMarkers.push(L.circleMarker(event.latlng, { radius: 6, color: '#f8d56e', fillOpacity: 1 }).addTo(this.map));
    if (this.directionMarkers.length !== 2) return;
    const [a, b] = this.directionMarkers.map(marker => marker.getLatLng());
    if (a.equals(b)) { this.clearDirection(); return; }
    const rad = Math.PI / 180, dl = (b.lng - a.lng) * rad;
    const bearing = Math.atan2(Math.sin(dl) * Math.cos(b.lat * rad), Math.cos(a.lat * rad) * Math.sin(b.lat * rad) - Math.sin(a.lat * rad) * Math.cos(b.lat * rad) * Math.cos(dl));
    this.angle = (bearing / rad + 360) % 360;
    this.latitude = Number(a.lat.toFixed(6)); this.longitude = Number(((((a.lng + 180) % 360 + 360) % 360) - 180).toFixed(6));
    this.orientation = Number(((this.angle + 90) % 360).toFixed(1));
    this.detectTimeZone();
    this.line = L.polyline([a, b], { color: '#ff785d', weight: 3 }).addTo(this.map);
    this.locationMarker?.remove();
    this.locationMarker = L.circleMarker(a, { radius: 7, color: '#ff785d', fillOpacity: 1 }).addTo(this.map);
  }
  detectTimeZone(): void {
    if (this.timeZoneMode !== 'automatic') return;
    try { this.timeZone = this.solarTime.detectZone(this.latitude, this.longitude); }
    catch { this.timeZone = ''; }
  }
  clearDirection(): void { this.directionMarkers.forEach(marker => marker.remove()); this.directionMarkers = []; this.line?.remove(); this.line = undefined; this.angle = null; }
  reverseOrientation(): void { this.orientation = (this.orientation + 180) % 360; }
  private localDate(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
}
