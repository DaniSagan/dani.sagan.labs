import { SolarTimeService } from './solar-time.service';

describe('Solar civil time', () => {
  const service = new SolarTimeService();
  it('detects zones from the calculation location rather than the browser location', () => {
    expect(service.detectZone(40.4168, -3.7038)).toBe('Europe/Madrid');
    expect(service.detectZone(28.1235, -15.4363)).toBe('Atlantic/Canary');
    expect(service.detectZone(40.7128, -74.006)).toBe('America/New_York');
  });
  it('uses the offset in force on each date', () => {
    expect(
      service.offsetAt(Date.parse('2024-01-15T12:00:00Z'), 'Europe/Madrid'),
    ).toBe(60);
    expect(
      service.offsetAt(Date.parse('2024-07-15T12:00:00Z'), 'Europe/Madrid'),
    ).toBe(120);
    expect(
      service.offsetAt(Date.parse('2024-07-15T12:00:00Z'), 'Asia/Kolkata'),
    ).toBe(330);
  });
  it('omits nonexistent hours and preserves both instances of repeated hours', () => {
    const spring = service.day('2024-03-31', 'Europe/Madrid', 0);
    expect(spring.lengthMinutes).toBe(1380);
    expect(spring.slots[150]).toEqual([]);
    expect(new Date(spring.slots[180][0]).toISOString()).toBe(
      '2024-03-31T01:00:00.000Z',
    );
    const autumn = service.day('2024-10-27', 'Europe/Madrid', 0);
    expect(autumn.lengthMinutes).toBe(1500);
    expect(
      autumn.slots[150].map((time) => new Date(time).toISOString()),
    ).toEqual(['2024-10-27T00:30:00.000Z', '2024-10-27T01:30:00.000Z']);
    expect(
      autumn.occurrences.every(
        (entry, i, entries) => !i || entry.timestamp > entries[i - 1].timestamp,
      ),
    ).toBeTrue();
  });
  it('handles southern-hemisphere seasons and half-hour DST changes', () => {
    expect(
      service.day('2024-10-06', 'Australia/Sydney', 0, 5).lengthMinutes,
    ).toBe(1380);
    expect(
      service.day('2024-04-07', 'Australia/Sydney', 0, 5).lengthMinutes,
    ).toBe(1500);
    expect(
      service.day('2024-10-06', 'Australia/Lord_Howe', 0).lengthMinutes,
    ).toBe(1410);
    expect(
      service.day('2024-04-07', 'Australia/Lord_Howe', 0).lengthMinutes,
    ).toBe(1470);
  });
  it('preserves fixed offsets and handles locations without seasonal changes', () => {
    const fixed = service.day('2024-03-31', null, 2);
    expect(fixed.lengthMinutes).toBe(1440);
    expect(new Date(fixed.slots[720][0]).toISOString()).toBe(
      '2024-03-31T10:00:00.000Z',
    );
    expect(service.day('2024-03-31', 'Asia/Kolkata', 0).lengthMinutes).toBe(
      1440,
    );
    expect(service.day('2011-12-30', 'Pacific/Apia', 0).lengthMinutes).toBe(0);
  });
});
