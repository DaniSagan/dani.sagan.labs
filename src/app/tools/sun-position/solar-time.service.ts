import { Injectable } from '@angular/core';
import tzLookup from '@photostructure/tz-lookup';

export interface CivilDay {
  slots: number[][];
  occurrences: { minute: number; timestamp: number }[];
  offsets: number[];
  lengthMinutes: number;
}

/** Civil clock conversion using the browser's IANA rules, including DST gaps/folds. */
@Injectable({ providedIn: 'root' })
export class SolarTimeService {
  private formatters = new Map<string, Intl.DateTimeFormat>();
  detectZone(latitude: number, longitude: number): string {
    const zone = tzLookup(latitude, longitude);
    this.formatter(zone); // Ensure this browser recognizes the geographical zone.
    return zone;
  }
  private formatter(zone: string): Intl.DateTimeFormat {
    let formatter = this.formatters.get(zone);
    if (!formatter) {
      formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: zone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23',
      } as Intl.DateTimeFormatOptions);
      this.formatters.set(zone, formatter);
    }
    return formatter;
  }
  offsetAt(timestamp: number, zone: string): number {
    const parts = this.formatter(zone).formatToParts(timestamp);
    const value = (type: string) =>
      Number(parts.find((part) => part.type === type)?.value);
    const civil = Date.UTC(
      value('year'),
      value('month') - 1,
      value('day'),
      value('hour'),
      value('minute'),
      value('second'),
    );
    return (civil - Math.floor(timestamp / 1000) * 1000) / 60000;
  }
  formatOffset(minutes: number): string {
    const absolute = Math.abs(minutes);
    return `UTC${minutes >= 0 ? '+' : '−'}${Math.floor(absolute / 60)}:${String(Math.floor(absolute % 60)).padStart(2, '0')}`;
  }

  day(
    date: string,
    zone: string | null,
    fixedOffset: number,
    step = 1,
  ): CivilDay {
    const base = Date.parse(date + 'T00:00:00Z');
    const slots: number[][] = Array.from({ length: 1440 / step }, () => []);
    const offsets = new Set<number>();
    const addSegment = (from: number, to: number, offset: number) => {
      for (let slot = 0; slot < slots.length; slot++) {
        const timestamp = base + (slot * step - offset) * 60000;
        if (timestamp >= from && timestamp < to) {
          slots[slot].push(timestamp);
          offsets.add(offset);
        }
      }
    };
    if (!zone) addSegment(-Infinity, Infinity, fixedOffset * 60);
    else {
      // An hour containing a clock change is split at its exact transition.
      // No assumption about transition dates, one-hour shifts or northern seasons.
      for (
        let from = base - 24 * 3600000;
        from < base + 48 * 3600000;
        from += 3600000
      ) {
        const to = from + 3600000;
        const first = this.offsetAt(from, zone),
          last = this.offsetAt(to - 1, zone);
        if (first === last) addSegment(from, to, first);
        else {
          let low = from,
            high = to;
          while (high - low > 1) {
            const middle = Math.floor((low + high) / 2);
            if (this.offsetAt(middle, zone) === first) low = middle;
            else high = middle;
          }
          addSegment(from, high, first);
          addSegment(high, to, last);
        }
      }
    }
    const occurrences = slots
      .flatMap((timestamps, slot) =>
        timestamps.map((timestamp) => ({ minute: slot * step, timestamp })),
      )
      .sort((a, b) => a.timestamp - b.timestamp);
    return {
      slots,
      occurrences,
      offsets: [...offsets],
      lengthMinutes: occurrences.length * step,
    };
  }
}
