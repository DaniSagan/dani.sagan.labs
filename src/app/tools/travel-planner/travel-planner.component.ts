import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { A11yModule } from '@angular/cdk/a11y';
import * as L from 'leaflet';

interface TravelActivity {
  cost?: number;
  category?: string;
  id: string;
  title: string;
  notes: string;
  start: string;
  end: string;
  latitude: number | null;
  longitude: number | null;
}

interface BagActivity {
  cost?: number;
  category?: string;
  id: string;
  title: string;
  notes: string;
  latitude: number | null;
  longitude: number | null;
}

interface TravelPlan {
  budget?: number;
  version: 2;
  name: string;
  activities: TravelActivity[];
  bagActivities?: BagActivity[];
}

interface SavedTravelDraft {
  budget?: number;
  scheduledBagActivityId?: string | null;
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
  imports: [CommonModule, FormsModule, A11yModule],
  templateUrl: './travel-planner.component.html',
  styleUrls: ['./travel-planner.component.css'],
})
export class TravelPlannerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  tripName = 'Mi viaje';
  budget = 0;
  view: 'agenda' | 'calendar' = 'agenda';
  storageMessage = '';
  readonly categories = ['Visita', 'Comida', 'Transporte', 'Alojamiento', 'Tiempo libre'];
  deletedActivity: TravelActivity | null = null;

  get totalCost(): number {
    return this.activities.reduce((sum, activity) => sum + (activity.cost ?? 0), 0);
  }

  get dayCost(): number {
    return this.selectedActivities.filter(a => a.start.substring(0, 10) === this.selectedDate).reduce((sum, activity) => sum + (activity.cost ?? 0), 0);
  }

  conflicts(activity: TravelActivity): boolean {
    return this.activities.some(other => other.id !== activity.id && other.start < activity.end && other.end > activity.start);
  }

  get conflictCount(): number {
    return this.selectedActivities.filter(activity => this.conflicts(activity)).length;
  }

  undoDelete(): void {
    if (!this.deletedActivity) return;
    this.activities = [...this.activities, this.deletedActivity];
    this.deletedActivity = null;
    this.renderMap();
    this.saveDraft();
  }

  directions(activity: TravelActivity): string {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.latitude + ',' + activity.longitude)}`;
  }

  exportCalendar(): void {
    const escape = (value: string) => value.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
    const stamp = (value: string) => value.replace(/[-:]/g, '') + '00';
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//DaniSagan//Travel Planner//ES', 'CALSCALE:GREGORIAN'];
    for (const activity of this.activities) {
      lines.push('BEGIN:VEVENT', `UID:${escape(activity.id)}@danisagan`, `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')}`, `DTSTART:${stamp(activity.start)}`, `DTEND:${stamp(activity.end)}`, `SUMMARY:${escape(activity.title)}`, `DESCRIPTION:${escape(activity.notes)}`);
      if (this.hasCoordinates(activity)) lines.push(`GEO:${activity.latitude};${activity.longitude}`);
      lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    const folded = lines.map(line => {
      let result = '', size = 0;
      for (const char of line) {
        const bytes = new TextEncoder().encode(char).length;
        if (size + bytes > 75) { result += '\r\n '; size = 1; }
        result += char; size += bytes;
      }
      return result;
    }).join('\r\n') + '\r\n';
    const url = URL.createObjectURL(new Blob([folded], { type: 'text/calendar;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${this.fileName(this.tripName)}.ics`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
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
  private activityEditMap?: L.Map;
  private activityEditMapMarker?: L.Layer;
  private readonly draftCookieName = 'travel_planner_draft';

  @ViewChild('activityEditMapElement')
  set activityEditMapElement(element: ElementRef<HTMLElement> | undefined) {
    if (element) this.initializeActivityEditMap(element.nativeElement);
  }

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
    this.renderMap();
    if (this.editingActivityId)
      window.setTimeout(() => this.initializeActivityEditMap(), 0);
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.destroyBagMap();
    this.destroyActivityEditMap();
  }

  get dates(): string[] {
    return [
      ...new Set([this.selectedDate, ...this.activities.flatMap(a => {
        const result: string[] = [];
        const day = new Date(a.start.substring(0, 10) + 'T00:00');
        while (day.getTime() < new Date(a.end).getTime() && result.length < 366) {
          result.push(this.toDateInput(day));
          day.setDate(day.getDate() + 1);
        }
        return result;
      })]),
    ].sort();
  }

  get selectedActivities(): TravelActivity[] {
    return this.activities
      .filter((a) => a.start < this.addMinutes(`${this.selectedDate}T00:00`, 1440) && a.end > `${this.selectedDate}T00:00`)
      .sort((a, b) => a.start.localeCompare(b.start));
  }

  get totalDuration(): number {
    const dayStart = new Date(`${this.selectedDate}T00:00`).getTime();
    const dayEnd = new Date(this.addMinutes(`${this.selectedDate}T00:00`, 1440)).getTime();
    return this.selectedActivities.reduce((total, activity) => {
      const start = Math.max(new Date(activity.start).getTime(), dayStart);
      const end = Math.min(new Date(activity.end).getTime(), dayEnd);
      return total + Math.max(0, end - start) / 60000;
    }, 0);
  }

  addActivity(): void {
    this.activityError = '';
    if (
      !this.draft.title.trim() ||
      !this.draft.start ||
      !this.draft.end ||
      !this.normalizeActivity(this.draft) ||
      new Date(this.draft.end).getTime() <= new Date(this.draft.start).getTime()
    ) {
      this.activityError =
        'Revisa el título, las fechas (fin posterior al inicio), el coste no negativo y las coordenadas: latitud de −90 a 90 y longitud de −180 a 180, o ambas vacías.';
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
    this.scheduledBagActivityId = null;
    this.editingActivityId = activity.id;
    this.activityError = '';
    this.draft = { ...activity };
    this.saveDraft();
    this.updateActivityEditMap();
    document.getElementById('activity-title')?.focus();
  }

  cancelEditing(): void {
    this.editingActivityId = null;
    this.scheduledBagActivityId = null;
    this.activityError = '';
    this.draft = this.createDraft();
    this.renderActivityEditMapMarker();
    this.saveDraft();
  }

  removeActivity(id: string): void {
    this.deletedActivity = this.activities.find(activity => activity.id === id) ?? null;
    this.activities = this.activities.filter((a) => a.id !== id);
    if (this.editingActivityId === id) this.cancelEditing();
    this.renderMap();
    this.saveDraft();
  }

  addToBag(): void {
    this.activityError = '';
    if (!this.draft.title.trim() || !this.validCoordinates(this.draft) || !Number.isFinite(this.draft.cost ?? 0) || (this.draft.cost ?? 0) < 0) {
      this.activityError = 'Revisa el título, el coste y las coordenadas antes de añadir a la bolsa.';
      return;
    }
    this.bagActivities = [
      ...this.bagActivities,
      {
        id: this.newId(),
        title: this.draft.title.trim(),
        notes: this.draft.notes,
        cost: this.draft.cost,
        category: this.draft.category,
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
      cost: activity.cost ?? 0,
      category: activity.category ?? 'Visita',
      latitude: activity.latitude,
      longitude: activity.longitude,
    };
    this.updateActivityEditMap();
    document.getElementById('activity-title')?.focus();
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
    if (!this.bagDraft.title.trim() || !this.validCoordinates(this.bagDraft)) {
      this.bagError = 'Introduce un nombre y unas coordenadas válidas (o deja ambas vacías).';
      return;
    }
    const activity = { ...this.bagDraft, title: this.bagDraft.title.trim() };
    this.bagActivities = this.bagActivities.map((current) =>
      current.id === this.editingBagActivityId ? activity : current,
    );
    this.cancelBagEditing();
  }

  selectDate(date: string): void {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
    this.selectedDate = date;
    if (!this.editingActivityId && !this.draft.title.trim()) {
      this.draft.start = `${date}T12:00`;
      this.draft.end = `${date}T14:00`;
    }
    this.renderMap();
    this.saveDraft();
  }

  download(): void {
    const plan: TravelPlan = {
      version: 2,
      budget: this.budget,
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
    if (file.size > 5 * 1024 * 1024) {
      this.importError = 'El archivo supera el límite de 5 MB.';
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const plan = JSON.parse(String(reader.result)) as {
          name?: unknown;
          budget?: unknown;
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
        const ids = [...activities, ...bagActivities].map(a => a!.id);
        if (new Set(ids).size !== ids.length || activities.some(a => !a!.title.trim()) || bagActivities.some(a => !a!.title.trim())) throw new Error('Actividades no válidas');
        if (plan.budget !== undefined && (typeof plan.budget !== 'number' || !Number.isFinite(plan.budget) || plan.budget < 0)) throw new Error('Presupuesto no válido');
        this.budget = typeof plan.budget === 'number' ? plan.budget : 0;
        this.deletedActivity = null;
        this.destroyBagMap();
        this.tripName = typeof plan.name === 'string' ? plan.name : 'Mi viaje';
        this.activities = activities as TravelActivity[];
        this.bagActivities = bagActivities as BagActivity[];
        this.editingBagActivityId = null;
        this.bagDraft = this.createBagDraft();
        this.bagError = '';
        this.selectedDate = this.activities.map(a => a.start.substring(0, 10)).sort()[0] ?? this.toDateInput(new Date());
        this.cancelEditing();
        this.renderMap();
        this.saveDraft();
      } catch {
        this.importError = 'El archivo no contiene un viaje valido.';
      } finally {
        input.value = '';
      }
    };
    reader.onerror = () => { this.importError = 'No se ha podido leer el archivo.'; input.value = ''; };
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
      budget: this.budget,
      scheduledBagActivityId: this.scheduledBagActivityId,
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
      localStorage.setItem(this.draftCookieName, JSON.stringify(draft));
      this.storageMessage = 'En este dispositivo · Guardado';
    } catch {
      this.storageMessage = 'No se ha podido guardar. Descarga una copia del viaje.';
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
    this.budget = 0;
    this.deletedActivity = null;
    this.destroyBagMap();
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
    this.renderActivityEditMapMarker();
    this.showNewTripDialog = false;
    this.renderMap();
    this.saveDraft();
  }

  calendarActivityStyle(activity: TravelActivity): Record<string, string> {
    const start = new Date(activity.start);
    const end = new Date(activity.end);
    const startMinutes = activity.start.substring(0, 10) < this.selectedDate ? 0 : start.getHours() * 60 + start.getMinutes();
    const endMinutes = activity.end.substring(0, 10) > this.selectedDate ? 1440 : end.getHours() * 60 + end.getMinutes();
    const top = Math.max(0, startMinutes);
    const columns: TravelActivity[][] = [];
    for (const current of this.selectedActivities) {
      let column = columns.find(items => items.every(item => item.end <= current.start));
      if (!column) { column = []; columns.push(column); }
      column.push(current);
    }
    const index = columns.findIndex(items => items.some(item => item.id === activity.id));
    return {
      left: `calc(${index * 100 / columns.length}% + 4px)`,
      width: `calc(${100 / columns.length}% - 8px)`,
      top: `${top}px`,
      height: `${Math.max(28, Math.min(1440, endMinutes) - top)}px`,
    };
  }

  private createDraft(): TravelActivity {
    return {
      id: this.newId(),
      title: '',
      cost: 0,
      category: 'Visita',
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

  private initializeActivityEditMap(mapElement?: HTMLElement): void {
    if (this.activityEditMap) return;
    const container = mapElement ?? document.getElementById('activity-edit-map');
    if (!container) return;
    const hasCoordinates = this.hasCoordinates(this.draft);
    this.activityEditMap = L.map(container, {
      center: hasCoordinates
        ? [this.draft.latitude!, this.draft.longitude!]
        : [41.0082, 28.9784],
      zoom: hasCoordinates ? 14 : 12,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.activityEditMap);
    this.activityEditMap.on('click', (event: L.LeafletMouseEvent) => {
      this.draft.latitude = this.roundCoordinate(event.latlng.lat);
      this.draft.longitude = this.roundCoordinate(event.latlng.lng);
      this.renderActivityEditMapMarker();
      this.saveDraft();
    });
    this.renderActivityEditMapMarker();
  }

  private updateActivityEditMap(): void {
    if (!this.activityEditMap) return;
    this.renderActivityEditMapMarker();
    if (this.hasCoordinates(this.draft))
      this.activityEditMap.setView(
        [this.draft.latitude!, this.draft.longitude!],
        14,
      );
  }

  private destroyActivityEditMap(): void {
    this.activityEditMap?.remove();
    this.activityEditMap = undefined;
    this.activityEditMapMarker = undefined;
  }

  private renderActivityEditMapMarker(): void {
    this.activityEditMapMarker?.remove();
    this.activityEditMapMarker = undefined;
    if (!this.activityEditMap || !this.hasCoordinates(this.draft)) return;
    this.activityEditMapMarker = L.circleMarker(
      [this.draft.latitude!, this.draft.longitude!],
      { radius: 9, color: '#075985', fillColor: '#0ea5e9', fillOpacity: 1, weight: 3 },
    ).addTo(this.activityEditMap);
  }

  private restoreDraft(): void {
    const value = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith(`${this.draftCookieName}=`));
    try {
      const stored = localStorage.getItem(this.draftCookieName);
      if (!stored && !value) return;
      const saved = JSON.parse(
        stored ?? decodeURIComponent(value!.substring(this.draftCookieName.length + 1)),
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
      if (activities.some((activity) => activity === null))
        return;
      this.tripName = saved.name;
      this.budget = typeof saved.budget === 'number' && Number.isFinite(saved.budget) && saved.budget >= 0 ? saved.budget : 0;
      this.activities = activities as TravelActivity[];
      this.selectedDate =
        typeof saved.selectedDate === 'string' && this.validDateTime(`${saved.selectedDate}T00:00`)
          ? saved.selectedDate
          : (this.dates[0] ?? this.toDateInput(new Date()));
      this.draft = activityDraft ?? this.createDraft();
      const bagActivities = Array.isArray(saved.bagActivities)
        ? saved.bagActivities.map((activity) => this.normalizeBagActivity(activity))
        : [];
      this.bagActivities = bagActivities.filter(
        (activity): activity is BagActivity => activity !== null,
      );
      this.scheduledBagActivityId = this.bagActivities.some(a => a.id === saved.scheduledBagActivityId) ? saved.scheduledBagActivityId! : null;
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
        !!activityDraft &&
        this.activities.some(
          (activity) => activity.id === saved.editingActivityId,
        )
          ? saved.editingActivityId
          : null;
      if (this.editingActivityId) this.draft.id = this.editingActivityId;
      this.saveDraft();
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
      !this.validDateTime(activity.start) ||
      !this.validDateTime(end) ||
      (activity.cost !== undefined && (typeof activity.cost !== 'number' || !Number.isFinite(activity.cost) || activity.cost < 0)) ||
      !this.validCoordinates(activity) ||
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
      cost: activity.cost ?? 0,
      category: this.categories.includes(activity.category ?? '') ? activity.category : 'Visita',
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
      !this.validCoordinates(activity) ||
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
      cost: typeof activity.cost === 'number' && Number.isFinite(activity.cost) && activity.cost >= 0 ? activity.cost : 0,
      category: this.categories.includes(activity.category ?? '') ? activity.category : 'Visita',
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
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  private validCoordinates(activity: Partial<BagActivity>): boolean {
    const { latitude: lat, longitude: lng } = activity;
    return (lat == null && lng == null) || (typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180);
  }
  private validDateTime(value: string): boolean {
    if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) return false;
    const date = new Date(value + 'Z');
    return Number.isFinite(date.getTime()) && date.toISOString().substring(0, 16) === value;
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
