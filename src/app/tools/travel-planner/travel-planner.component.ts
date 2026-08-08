import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

interface TravelActivity {
  id: string;
  title: string;
  start: string;
  end: string;
  latitude: number | null;
  longitude: number | null;
}

interface TravelPlan {
  version: 2;
  name: string;
  activities: TravelActivity[];
}

@Component({
  selector: 'app-travel-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './travel-planner.component.html',
  styleUrls: ['./travel-planner.component.css'],
})
export class TravelPlannerComponent implements AfterViewInit, OnDestroy {
  tripName = 'Mi viaje';
  activities: TravelActivity[] = [];
  selectedDate = this.toDateInput(new Date());
  draft: TravelActivity = this.createDraft();
  importError = '';
  activityError = '';
  editingActivityId: string | null = null;
  readonly calendarHours = Array.from({ length: 24 }, (_, hour) => hour);
  private map?: L.Map;
  private markers: L.Layer[] = [];

  ngAfterViewInit(): void {
    this.map = L.map('travel-planner-map', { center: [41.0082, 28.9784], zoom: 12 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.draft.latitude = this.roundCoordinate(event.latlng.lat);
      this.draft.longitude = this.roundCoordinate(event.latlng.lng);
    });
    this.renderMap();
  }

  ngOnDestroy(): void { this.map?.remove(); }

  get dates(): string[] {
    return [...new Set(this.activities.map((a) => a.start.substring(0, 10)))].sort();
  }

  get selectedActivities(): TravelActivity[] {
    return this.activities
      .filter((a) => a.start.substring(0, 10) === this.selectedDate)
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  get totalDuration(): number {
    return this.selectedActivities.reduce((total, activity) => total + this.durationInMinutes(activity), 0);
  }

  addActivity(): void {
    this.activityError = '';
    if (!this.draft.title.trim() || !this.draft.start || !this.draft.end ||
      new Date(this.draft.end).getTime() <= new Date(this.draft.start).getTime()) {
      this.activityError = 'Introduce una actividad y una fecha y hora de fin posterior al inicio.';
      return;
    }
    const activity = { ...this.draft, title: this.draft.title.trim() };
    this.activities = this.editingActivityId
      ? this.activities.map((current) => current.id === this.editingActivityId ? activity : current)
      : [...this.activities, activity];
    this.selectedDate = activity.start.substring(0, 10);
    this.cancelEditing();
    this.renderMap();
  }

  startEditing(activity: TravelActivity): void {
    this.editingActivityId = activity.id;
    this.activityError = '';
    this.draft = { ...activity };
  }

  cancelEditing(): void {
    this.editingActivityId = null;
    this.activityError = '';
    this.draft = this.createDraft();
  }

  removeActivity(id: string): void {
    this.activities = this.activities.filter((a) => a.id !== id);
    if (this.editingActivityId === id) this.cancelEditing();
    this.renderMap();
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.draft.start = `${date}T12:00`;
    this.draft.end = `${date}T14:00`;
    this.renderMap();
  }

  download(): void {
    const plan: TravelPlan = { version: 2, name: this.tripName.trim() || 'Mi viaje', activities: this.activities };
    const url = URL.createObjectURL(new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.fileName(plan.name)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  importPlan(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.importError = '';
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const plan = JSON.parse(String(reader.result)) as { name?: unknown; activities?: unknown[] };
        if (!Array.isArray(plan.activities)) throw new Error('Formato no valido');
        const activities = plan.activities.map((activity) => this.normalizeActivity(activity));
        if (activities.some((activity) => activity === null)) throw new Error('Formato no valido');
        this.tripName = typeof plan.name === 'string' ? plan.name : 'Mi viaje';
        this.activities = activities as TravelActivity[];
        this.selectedDate = this.dates[0] ?? this.toDateInput(new Date());
        this.cancelEditing();
        this.renderMap();
      } catch {
        this.importError = 'El archivo no contiene un viaje valido.';
      } finally { input.value = ''; }
    };
    reader.readAsText(file);
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return !h ? `${m} min` : m ? `${h} h ${m} min` : `${h} h`;
  }

  formatTime(dateTime: string): string { return dateTime.substring(11, 16); }
  formatRange(activity: TravelActivity): string { return `${this.formatTime(activity.start)} – ${this.formatTime(activity.end)}`; }

  calendarActivityStyle(activity: TravelActivity): Record<string, string> {
    const start = new Date(activity.start);
    const end = new Date(activity.end);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const top = Math.max(0, startMinutes);
    return { top: `${top}px`, height: `${Math.max(28, Math.min(1440, endMinutes) - top)}px` };
  }

  private createDraft(): TravelActivity {
    return { id: this.newId(), title: '', start: `${this.selectedDate}T12:00`, end: `${this.selectedDate}T14:00`, latitude: null, longitude: null };
  }

  private renderMap(): void {
    if (!this.map) return;
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    const geolocated = this.selectedActivities.filter(this.hasCoordinates);
    geolocated.forEach((activity, index) => {
      const marker = L.circleMarker([activity.latitude!, activity.longitude!], { radius: 9, color: '#075985', fillColor: '#0ea5e9', fillOpacity: 1, weight: 3 })
        .bindPopup(`<strong>${this.escapeHtml(activity.title)}</strong><br>${this.formatRange(activity)}`)
        .addTo(this.map!);
      marker.bindTooltip(String(index + 1), { permanent: true, direction: 'center', className: 'travel-marker-label' });
      this.markers.push(marker);
    });
    if (geolocated.length === 1) this.map.setView([geolocated[0].latitude!, geolocated[0].longitude!], 14);
    if (geolocated.length > 1) this.map.fitBounds(L.latLngBounds(geolocated.map((a) => [a.latitude!, a.longitude!] as L.LatLngExpression)), { padding: [32, 32] });
    window.setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private hasCoordinates(activity: TravelActivity): boolean {
    return activity.latitude !== null && activity.longitude !== null && Number.isFinite(activity.latitude) && Number.isFinite(activity.longitude);
  }

  private normalizeActivity(value: unknown): TravelActivity | null {
    if (!value || typeof value !== 'object') return null;
    const activity = value as Partial<TravelActivity> & { durationMinutes?: unknown };
    const end = typeof activity.end === 'string' ? activity.end :
      typeof activity.start === 'string' && typeof activity.durationMinutes === 'number' ? this.addMinutes(activity.start, activity.durationMinutes) : null;
    if (!activity || typeof activity.id !== 'string' || typeof activity.title !== 'string' || typeof activity.start !== 'string' ||
      !end || new Date(end).getTime() <= new Date(activity.start).getTime() ||
      (activity.latitude !== null && typeof activity.latitude !== 'number') ||
      (activity.longitude !== null && typeof activity.longitude !== 'number')) return null;
    return { id: activity.id, title: activity.title, start: activity.start, end, latitude: activity.latitude ?? null, longitude: activity.longitude ?? null };
  }

  private durationInMinutes(activity: TravelActivity): number {
    return Math.round((new Date(activity.end).getTime() - new Date(activity.start).getTime()) / 60000);
  }

  private addMinutes(dateTime: string, minutes: number): string {
    const date = new Date(dateTime);
    date.setMinutes(date.getMinutes() + minutes);
    return `${this.toDateInput(date)}T${date.toTimeString().substring(0, 5)}`;
  }

  private toDateInput(date: Date): string { return date.toISOString().substring(0, 10); }
  private newId(): string { return typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`; }
  private fileName(name: string): string { return name.toLowerCase().trim().replace(/[^a-z0-9]+/gi, '-').replace(/(^-|-$)/g, '') || 'viaje'; }
  private roundCoordinate(value: number): number { return Math.round(value * 1000000) / 1000000; }
  private escapeHtml(value: string): string { const element = document.createElement('div'); element.textContent = value; return element.innerHTML; }
}
