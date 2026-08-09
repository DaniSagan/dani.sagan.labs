import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

interface TravelActivity {
  id: string;
  title: string;
  notes: string;
  start: string;
  end: string;
  latitude: number | null;
  longitude: number | null;
}

interface BagActivity {
  id: string;
  title: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
}

interface TravelPlan {
  version: 2;
  name: string;
  activities: TravelActivity[];
  bagActivities?: BagActivity[];
}

interface SavedTravelDraft {
  version: 3;
  name: string;
  activities: TravelActivity[];
  selectedDate: string;
  activityDraft: TravelActivity;
  editingActivityId: string | null;
  bagActivities?: BagActivity[];
  bagDraft?: BagActivity;
  editingBagActivityId?: string | null;
}

@Component({
  selector: 'app-travel-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './travel-planner.component.html',
  styleUrls: ['./travel-planner.component.css'],
})
export class TravelPlannerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  tripName = 'Mi viaje';
  activities: TravelActivity[] = [];
  bagActivities: BagActivity[] = [];
  bagDraft: BagActivity = this.createBagDraft();
  selectedDate = this.toDateInput(new Date());
  draft: TravelActivity = this.createDraft();
  importError = '';
  activityError = '';
  editingActivityId: string | null = null;
  scheduledBagActivityId: string | null = null;
  editingBagActivityId: string | null = null;
  bagError = '';
  showNewTripDialog = false;
  readonly calendarHours = Array.from({ length: 24 }, (_, hour) => hour);
  private map?: L.Map;
  private markers: L.Layer[] = [];
  private bagMap?: L.Map;
  private bagMapMarker?: L.Layer;
  private readonly draftCookieName = 'travel_planner_draft';

  ngOnInit(): void {
    this.restoreDraft();
  }

  ngAfterViewInit(): void {
    this.map = L.map('travel-planner-map', {
      center: [41.0082, 28.9784],
      zoom: 12,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.map.on('click', (event: L.LeafletMouseEvent) => {
      this.draft.latitude = this.roundCoordinate(event.latlng.lat);
      this.draft.longitude = this.roundCoordinate(event.latlng.lng);
      this.saveDraft();
    });
    this.renderMap();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.destroyBagMap();
  }

  get dates(): string[] {
    return [
      ...new Set(this.activities.map((a) => a.start.substring(0, 10))),
    ].sort();
  }

  get selectedActivities(): TravelActivity[] {
    return this.activities
      .filter((a) => a.start.substring(0, 10) === this.selectedDate)
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  get totalDuration(): number {
    return this.selectedActivities.reduce(
      (total, activity) => total + this.durationInMinutes(activity),
      0,
    );
  }

  addActivity(): void {
    this.activityError = '';
    if (
      !this.draft.title.trim() ||
      !this.draft.start ||
      !this.draft.end ||
      new Date(this.draft.end).getTime() <= new Date(this.draft.start).getTime()
    ) {
      this.activityError =
        'Introduce una actividad y una fecha y hora de fin posterior al inicio.';
      return;
    }
    const activity = { ...this.draft, title: this.draft.title.trim() };
    this.activities = this.editingActivityId
      ? this.activities.map((current) =>
          current.id === this.editingActivityId ? activity : current,
        )
      : [...this.activities, activity];
    if (this.scheduledBagActivityId) {
      this.bagActivities = this.bagActivities.filter(
        (bagActivity) => bagActivity.id !== this.scheduledBagActivityId,
      );
      this.scheduledBagActivityId = null;
    }
    this.selectedDate = activity.start.substring(0, 10);
    this.cancelEditing();
    this.renderMap();
    this.saveDraft();
  }

  startEditing(activity: TravelActivity): void {
    this.editingActivityId = activity.id;
    this.activityError = '';
    this.draft = { ...activity };
    this.saveDraft();
  }

  cancelEditing(): void {
    this.editingActivityId = null;
    this.scheduledBagActivityId = null;
    this.activityError = '';
    this.draft = this.createDraft();
    this.saveDraft();
  }

  removeActivity(id: string): void {
    this.activities = this.activities.filter((a) => a.id !== id);
    if (this.editingActivityId === id) this.cancelEditing();
    this.renderMap();
    this.saveDraft();
  }

  addToBag(): void {
    this.activityError = '';
    if (!this.draft.title.trim()) {
      this.activityError = 'Introduce una actividad para añadirla a la bolsa.';
      return;
    }
    this.bagActivities = [
      ...this.bagActivities,
      {
        id: this.newId(),
        title: this.draft.title.trim(),
        notes: this.draft.notes,
        latitude: this.draft.latitude,
        longitude: this.draft.longitude,
      },
    ];
    this.scheduledBagActivityId = null;
    this.activityError = '';
    this.draft = this.createDraft();
    this.saveDraft();
  }

  scheduleBagActivity(activity: BagActivity): void {
    this.editingActivityId = null;
    this.scheduledBagActivityId = activity.id;
    this.activityError = '';
    this.draft = {
      ...this.createDraft(),
      id: activity.id,
      title: activity.title,
      notes: activity.notes,
      latitude: activity.latitude,
      longitude: activity.longitude,
    };
    this.saveDraft();
  }

  removeBagActivity(id: string): void {
    this.bagActivities = this.bagActivities.filter((activity) => activity.id !== id);
    if (this.scheduledBagActivityId === id) this.cancelEditing();
    if (this.editingBagActivityId === id) this.cancelBagEditing();
    this.saveDraft();
  }

  startEditingBag(activity: BagActivity): void {
    this.destroyBagMap();
    this.editingBagActivityId = activity.id;
    this.bagError = '';
    this.bagDraft = { ...activity };
    this.saveDraft();
    window.setTimeout(() => this.initializeBagMap(), 0);
  }

  cancelBagEditing(): void {
    this.destroyBagMap();
    this.editingBagActivityId = null;
    this.bagError = '';
    this.bagDraft = this.createBagDraft();
    this.saveDraft();
  }

  saveBagActivity(): void {
    if (!this.editingBagActivityId) return;
    if (!this.bagDraft.title.trim()) {
      this.bagError = 'Introduce un nombre para la actividad.';
      return;
    }
    const activity = { ...this.bagDraft, title: this.bagDraft.title.trim() };
    this.bagActivities = this.bagActivities.map((current) =>
      current.id === this.editingBagActivityId ? activity : current,
    );
    this.cancelBagEditing();
  }

  selectDate(date: string): void {
    this.selectedDate = date;
    this.draft.start = `${date}T12:00`;
    this.draft.end = `${date}T14:00`;
    this.renderMap();
    this.saveDraft();
  }

  download(): void {
    const plan: TravelPlan = {
      version: 2,
      name: this.tripName.trim() || 'Mi viaje',
      activities: this.activities,
      bagActivities: this.bagActivities,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(plan, null, 2)], { type: 'application/json' }),
    );
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
        const plan = JSON.parse(String(reader.result)) as {
          name?: unknown;
          activities?: unknown[];
          bagActivities?: unknown[];
        };
        if (!Array.isArray(plan.activities))
          throw new Error('Formato no valido');
        const activities = plan.activities.map((activity) =>
          this.normalizeActivity(activity),
        );
        const bagActivities = Array.isArray(plan.bagActivities)
          ? plan.bagActivities.map((activity) => this.normalizeBagActivity(activity))
          : [];
        if (activities.some((activity) => activity === null))
          throw new Error('Formato no valido');
        if (bagActivities.some((activity) => activity === null))
          throw new Error('Formato no valido');
        this.tripName = typeof plan.name === 'string' ? plan.name : 'Mi viaje';
        this.activities = activities as TravelActivity[];
        this.bagActivities = bagActivities as BagActivity[];
        this.editingBagActivityId = null;
        this.bagDraft = this.createBagDraft();
        this.bagError = '';
        this.selectedDate = this.dates[0] ?? this.toDateInput(new Date());
        this.cancelEditing();
        this.renderMap();
        this.saveDraft();
      } catch {
        this.importError = 'El archivo no contiene un viaje valido.';
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(file);
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return !h ? `${m} min` : m ? `${h} h ${m} min` : `${h} h`;
  }

  formatTime(dateTime: string): string {
    return dateTime.substring(11, 16);
  }
  formatRange(activity: TravelActivity): string {
    return `${this.formatTime(activity.start)} – ${this.formatTime(activity.end)}`;
  }

  saveDraft(): void {
    const draft: SavedTravelDraft = {
      version: 3,
      name: this.tripName,
      activities: this.activities,
      selectedDate: this.selectedDate,
      activityDraft: this.draft,
      editingActivityId: this.editingActivityId,
      bagActivities: this.bagActivities,
      bagDraft: this.bagDraft,
      editingBagActivityId: this.editingBagActivityId,
    };
    try {
      document.cookie = `${this.draftCookieName}=${encodeURIComponent(JSON.stringify(draft))}; max-age=31536000; path=/; samesite=lax`;
    } catch {
      // Si el navegador no puede guardar la cookie, el planificador sigue funcionando normalmente.
    }
  }

  openNewTripDialog(): void {
    this.showNewTripDialog = true;
  }
  cancelNewTrip(): void {
    this.showNewTripDialog = false;
  }

  saveAndStartNewTrip(): void {
    this.download();
    this.startNewTrip();
  }

  startNewTrip(): void {
    this.tripName = 'Mi viaje';
    this.activities = [];
    this.bagActivities = [];
    this.selectedDate = this.toDateInput(new Date());
    this.editingActivityId = null;
    this.scheduledBagActivityId = null;
    this.editingBagActivityId = null;
    this.bagDraft = this.createBagDraft();
    this.bagError = '';
    this.activityError = '';
    this.importError = '';
    this.draft = this.createDraft();
    this.showNewTripDialog = false;
    this.renderMap();
    this.saveDraft();
  }

  calendarActivityStyle(activity: TravelActivity): Record<string, string> {
    const start = new Date(activity.start);
    const end = new Date(activity.end);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const top = Math.max(0, startMinutes);
    return {
      top: `${top}px`,
      height: `${Math.max(28, Math.min(1440, endMinutes) - top)}px`,
    };
  }

  private createDraft(): TravelActivity {
    return {
      id: this.newId(),
      title: '',
      notes: '',
      start: `${this.selectedDate}T12:00`,
      end: `${this.selectedDate}T14:00`,
      latitude: null,
      longitude: null,
    };
  }

  private createBagDraft(): BagActivity {
    return {
      id: this.newId(),
      title: '',
      notes: '',
      latitude: null,
      longitude: null,
    };
  }

  private initializeBagMap(): void {
    if (!this.editingBagActivityId || this.bagMap) return;
    const hasCoordinates = this.hasBagCoordinates(this.bagDraft);
    this.bagMap = L.map('bag-activity-map', {
      center: hasCoordinates
        ? [this.bagDraft.latitude!, this.bagDraft.longitude!]
        : [41.0082, 28.9784],
      zoom: hasCoordinates ? 14 : 12,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.bagMap);
    this.bagMap.on('click', (event: L.LeafletMouseEvent) => {
      this.bagDraft.latitude = this.roundCoordinate(event.latlng.lat);
      this.bagDraft.longitude = this.roundCoordinate(event.latlng.lng);
      this.renderBagMapMarker();
      this.saveDraft();
    });
    this.renderBagMapMarker();
  }

  private destroyBagMap(): void {
    this.bagMap?.remove();
    this.bagMap = undefined;
    this.bagMapMarker = undefined;
  }

  private renderBagMapMarker(): void {
    this.bagMapMarker?.remove();
    this.bagMapMarker = undefined;
    if (!this.bagMap || !this.hasBagCoordinates(this.bagDraft)) return;
    this.bagMapMarker = L.circleMarker(
      [this.bagDraft.latitude!, this.bagDraft.longitude!],
      { radius: 9, color: '#075985', fillColor: '#0ea5e9', fillOpacity: 1, weight: 3 },
    ).addTo(this.bagMap);
  }

  private restoreDraft(): void {
    const value = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${this.draftCookieName}=`));
    if (!value) return;
    try {
      const saved = JSON.parse(
        decodeURIComponent(value.substring(this.draftCookieName.length + 1)),
      ) as Partial<SavedTravelDraft>;
      if (
        saved.version !== 3 ||
        typeof saved.name !== 'string' ||
        !Array.isArray(saved.activities)
      )
        return;
      const activities = saved.activities.map((activity) =>
        this.normalizeActivity(activity),
      );
      const activityDraft = this.normalizeActivity(saved.activityDraft);
      if (activities.some((activity) => activity === null) || !activityDraft)
        return;
      this.tripName = saved.name;
      this.activities = activities as TravelActivity[];
      this.selectedDate =
        typeof saved.selectedDate === 'string'
          ? saved.selectedDate
          : (this.dates[0] ?? this.toDateInput(new Date()));
      this.draft = activityDraft;
      const bagActivities = Array.isArray(saved.bagActivities)
        ? saved.bagActivities.map((activity) => this.normalizeBagActivity(activity))
        : [];
      this.bagActivities = bagActivities.filter(
        (activity): activity is BagActivity => activity !== null,
      );
      const savedBagDraft = this.normalizeBagActivity(saved.bagDraft);
      this.editingBagActivityId =
        typeof saved.editingBagActivityId === 'string' &&
        this.bagActivities.some(
          (activity) => activity.id === saved.editingBagActivityId,
        ) &&
        savedBagDraft
          ? saved.editingBagActivityId
          : null;
      this.bagDraft =
        this.editingBagActivityId && savedBagDraft
          ? savedBagDraft
          : this.createBagDraft();
      this.editingActivityId =
        typeof saved.editingActivityId === 'string' &&
        this.activities.some(
          (activity) => activity.id === saved.editingActivityId,
        )
          ? saved.editingActivityId
          : null;
    } catch {
      // Una cookie antigua o dañada no debe impedir abrir el planificador.
    }
  }

  private renderMap(): void {
    if (!this.map) return;
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
    const geolocated = this.selectedActivities.filter(this.hasCoordinates);
    geolocated.forEach((activity, index) => {
      const marker = L.circleMarker([activity.latitude!, activity.longitude!], {
        radius: 9,
        color: '#075985',
        fillColor: '#0ea5e9',
        fillOpacity: 1,
        weight: 3,
      })
        .bindPopup(
          `<strong>${this.escapeHtml(activity.title)}</strong><br>${this.formatRange(activity)}`,
        )
        .addTo(this.map!);
      marker.bindTooltip(String(index + 1), {
        permanent: true,
        direction: 'center',
        className: 'travel-marker-label',
      });
      this.markers.push(marker);
    });
    if (geolocated.length === 1)
      this.map.setView([geolocated[0].latitude!, geolocated[0].longitude!], 14);
    if (geolocated.length > 1)
      this.map.fitBounds(
        L.latLngBounds(
          geolocated.map(
            (a) => [a.latitude!, a.longitude!] as L.LatLngExpression,
          ),
        ),
        { padding: [32, 32] },
      );
    window.setTimeout(() => this.map?.invalidateSize(), 0);
  }

  private hasCoordinates(activity: TravelActivity): boolean {
    return (
      activity.latitude !== null &&
      activity.longitude !== null &&
      Number.isFinite(activity.latitude) &&
      Number.isFinite(activity.longitude)
    );
  }

  private hasBagCoordinates(activity: BagActivity): boolean {
    return (
      activity.latitude !== null &&
      activity.longitude !== null &&
      Number.isFinite(activity.latitude) &&
      Number.isFinite(activity.longitude)
    );
  }

  private normalizeActivity(value: unknown): TravelActivity | null {
    if (!value || typeof value !== 'object') return null;
    const activity = value as Partial<TravelActivity> & {
      durationMinutes?: unknown;
    };
    const end =
      typeof activity.end === 'string'
        ? activity.end
        : typeof activity.start === 'string' &&
            typeof activity.durationMinutes === 'number'
          ? this.addMinutes(activity.start, activity.durationMinutes)
          : null;
    if (
      !activity ||
      typeof activity.id !== 'string' ||
      typeof activity.title !== 'string' ||
      typeof activity.start !== 'string' ||
      !end ||
      new Date(end).getTime() <= new Date(activity.start).getTime() ||
      (activity.latitude !== null &&
        activity.latitude !== undefined &&
        typeof activity.latitude !== 'number') ||
      (activity.longitude !== null &&
        activity.longitude !== undefined &&
        typeof activity.longitude !== 'number')
    )
      return null;
    return {
      id: activity.id,
      title: activity.title,
      notes: typeof activity.notes === 'string' ? activity.notes : '',
      start: activity.start,
      end,
      latitude: activity.latitude ?? null,
      longitude: activity.longitude ?? null,
    };
  }

  private normalizeBagActivity(value: unknown): BagActivity | null {
    if (!value || typeof value !== 'object') return null;
    const activity = value as Partial<BagActivity>;
    if (
      typeof activity.id !== 'string' ||
      typeof activity.title !== 'string' ||
      (activity.latitude !== null &&
        activity.latitude !== undefined &&
        typeof activity.latitude !== 'number') ||
      (activity.longitude !== null &&
        activity.longitude !== undefined &&
        typeof activity.longitude !== 'number')
    )
      return null;
    return {
      id: activity.id,
      title: activity.title,
      notes: typeof activity.notes === 'string' ? activity.notes : '',
      latitude: activity.latitude ?? null,
      longitude: activity.longitude ?? null,
    };
  }

  private durationInMinutes(activity: TravelActivity): number {
    return Math.round(
      (new Date(activity.end).getTime() - new Date(activity.start).getTime()) /
        60000,
    );
  }

  private addMinutes(dateTime: string, minutes: number): string {
    const date = new Date(dateTime);
    date.setMinutes(date.getMinutes() + minutes);
    return `${this.toDateInput(date)}T${date.toTimeString().substring(0, 5)}`;
  }

  private toDateInput(date: Date): string {
    return date.toISOString().substring(0, 10);
  }
  private newId(): string {
    return typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`;
  }
  private fileName(name: string): string {
    return (
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/gi, '-')
        .replace(/(^-|-$)/g, '') || 'viaje'
    );
  }
  private roundCoordinate(value: number): number {
    return Math.round(value * 1000000) / 1000000;
  }
  private escapeHtml(value: string): string {
    const element = document.createElement('div');
    element.textContent = value;
    return element.innerHTML;
  }
}
