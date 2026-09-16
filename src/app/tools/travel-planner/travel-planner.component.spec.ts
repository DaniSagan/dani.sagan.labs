import { TravelPlannerComponent } from './travel-planner.component';

describe('TravelPlannerComponent', () => {
  let component: TravelPlannerComponent;
  const activity = (id: string, start = '2026-09-16T10:00', end = '2026-09-16T11:00') => ({
    id, title: 'Museo', notes: '', start, end, latitude: null, longitude: null, cost: 15,
  });

  beforeEach(() => {
    component = new TravelPlannerComponent();
    component.selectedDate = '2026-09-16';
    spyOn(Storage.prototype, 'setItem');
  });

  it('shows an overnight activity on both days and clips its daily duration', () => {
    component.activities = [activity('night', '2026-09-16T23:00', '2026-09-17T02:00')];
    expect(component.totalDuration).toBe(60);
    component.selectDate('2026-09-17');
    expect(component.selectedActivities.length).toBe(1);
    expect(component.totalDuration).toBe(120);
    expect(component.dayCost).toBe(0);
    expect(component.calendarActivityStyle(component.activities[0]).height).toBe('120px');
  });

  it('detects overlapping visits but allows adjacent visits', () => {
    component.activities = [activity('a'), activity('b', '2026-09-16T10:30', '2026-09-16T11:30')];
    expect(component.conflictCount).toBe(2);
    component.activities[1].start = '2026-09-16T11:00';
    expect(component.conflictCount).toBe(0);
  });

  it('rejects invalid dates and out-of-range coordinates', () => {
    component.draft = activity('bad', 'invalid');
    component.addActivity();
    expect(component.activities.length).toBe(0);
    component.draft = { ...activity('bad'), latitude: 100, longitude: 0 };
    component.addActivity();
    expect(component.activities.length).toBe(0);
  });

  it('preserves edits when navigating to another day', () => {
    component.startEditing(activity('edit'));
    component.selectDate('2026-09-20');
    expect(component.draft.start).toBe('2026-09-16T10:00');
  });

  it('restores a deleted activity once, including its cost', () => {
    component.activities = [activity('a')];
    component.removeActivity('a');
    expect(component.totalCost).toBe(0);
    component.undoDelete();
    component.undoDelete();
    expect(component.activities.length).toBe(1);
    expect(component.totalCost).toBe(15);
  });

  it('preserves category and cost through the ideas bag', () => {
    component.draft = { ...activity('a'), category: 'Comida' };
    component.addToBag();
    component.scheduleBagActivity(component.bagActivities[0]);
    component.addActivity();
    expect(component.bagActivities.length).toBe(0);
    expect(component.activities[0].category).toBe('Comida');
    expect(component.totalCost).toBe(15);
  });

  it('reports a storage failure without discarding the itinerary', () => {
    (Storage.prototype.setItem as jasmine.Spy).and.throwError('QuotaExceededError');
    component.activities = [activity('a')];
    component.saveDraft();
    expect(component.storageMessage).toContain('No se ha podido guardar');
    expect(component.activities.length).toBe(1);
  });

  it('restores the itinerary even when an unfinished form has invalid dates', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify({
      version: 3, name: 'Escapada', activities: [activity('a')], selectedDate: '2026-09-16',
      activityDraft: { ...activity('draft'), end: '' }, budget: 150,
    }));
    component.ngOnInit();
    expect(component.activities.length).toBe(1);
    expect(component.budget).toBe(150);
    expect(component.draft.title).toBe('');
  });

  it('restores a pending idea without duplicating it when scheduled', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(JSON.stringify({
      version: 3, name: 'Escapada', activities: [], selectedDate: '2026-09-16',
      activityDraft: activity('idea'), bagActivities: [activity('idea')], scheduledBagActivityId: 'idea',
    }));
    component.ngOnInit();
    component.addActivity();
    expect(component.activities.length).toBe(1);
    expect(component.bagActivities.length).toBe(0);
  });

  it('exports escaped calendar text with floating destination times', async () => {
    const create = spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(HTMLAnchorElement.prototype, 'click');
    spyOn(window, 'setTimeout');
    component.activities = [{ ...activity('a'), title: 'Museo, café', notes: 'Reserva; confirmada\nEntrada' }];
    component.exportCalendar();
    const content = await (create.calls.mostRecent().args[0] as Blob).text();
    expect(content).toContain('DTSTART:20260916T100000\r\n');
    expect(content).toContain('SUMMARY:Museo\\, café');
    expect(content).toContain('DESCRIPTION:Reserva\\; confirmada\\nEntrada');
    expect(content.endsWith('END:VCALENDAR\r\n')).toBe(true);
  });

  it('rejects impossible calendar dates', () => {
    component.draft = activity('bad', '2026-02-30T10:00', '2026-03-03T10:00');
    component.addActivity();
    expect(component.activities.length).toBe(0);
  });
});
