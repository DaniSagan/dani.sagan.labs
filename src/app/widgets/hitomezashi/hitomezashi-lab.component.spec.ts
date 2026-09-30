import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HitomezashiLabComponent } from './hitomezashi-lab.component';

describe('Hitomezashi laboratory', () => {
  let fixture: ComponentFixture<HitomezashiLabComponent>;
  let lab: HitomezashiLabComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HitomezashiLabComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(HitomezashiLabComponent);
    lab = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('renders 20 cells, 21 bits per direction and 420 segments', () => {
    expect(fixture.nativeElement.querySelectorAll('.bits button').length).toBe(
      42,
    );
    expect(fixture.nativeElement.querySelectorAll('.stitch').length).toBe(420);
  });
  it('links keyboard focus and bit clicks to the corresponding row', fakeAsync(() => {
    const button = fixture.nativeElement.querySelector(
      '.bits button',
    ) as HTMLButtonElement;
    button.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(lab.active).toEqual({ horizontal: true, line: 0 });
    const before = lab.rows[0],
      columns = [...lab.columns];
    button.click();
    fixture.detectChanges();
    expect(lab.rows[0]).toBe(before ? 0 : 1);
    expect(lab.columns).toEqual(columns);
    expect(lab.mode).toBe('manual');
    expect(lab.changed).not.toBeNull();
    tick(450);
    expect(lab.changed).toBeNull();
  }));
  it('animates rows before columns, pauses, resets and releases timers', fakeAsync(() => {
    lab.play();
    expect(lab.visible.length).toBe(0);
    tick(140 * 21);
    expect(lab.visible.every((e) => e.horizontal)).toBeTrue();
    lab.pause();
    const p = lab.progress;
    tick(280);
    expect(lab.progress).toBe(p);
    lab.play();
    tick(140);
    expect(lab.visible.some((e) => !e.horizontal)).toBeTrue();
    lab.reset();
    expect(lab.progress).toBe(0);
    lab.play();
    tick(140 * 42);
    expect(lab.complete).toBeTrue();
    expect(lab.timer).toBeUndefined();
    lab.play();
    fixture.destroy();
    tick(500);
    expect(lab.timer).toBeUndefined();
  }));
  it('handles presets, resizing, invalid inputs and recovery', () => {
    lab.preset('zeros');
    expect(lab.rows.every((b) => b === 0)).toBeTrue();
    lab.preset('symmetric');
    expect(lab.rows).toEqual(lab.columns);
    lab.preset('bands');
    expect(lab.rows.slice(0, 4)).toEqual([0, 0, 1, 1]);
    lab.size = 40;
    lab.generate();
    expect(lab.rows.length).toBe(41);
    lab.size = 3;
    lab.generate();
    fixture.detectChanges();
    expect(lab.error).not.toBe('');
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    lab.size = 4;
    lab.rowPattern = '2';
    lab.generate();
    expect(lab.error).not.toBe('');
    lab.rowPattern = '01';
    lab.generate();
    expect(lab.error).toBe('');
    lab.seed = NaN;
    lab.generate();
    expect(lab.error).not.toBe('');
  });
  it('validates size while typing before generating SVG coordinates', () => {
    const input = fixture.nativeElement.querySelector(
      'input[type=number]',
    ) as HTMLInputElement;
    input.value = '999999';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(lab.error).not.toBe('');
    expect(fixture.nativeElement.querySelector('svg')).toBeNull();
    input.value = '8';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(lab.error).toBe('');
    expect(lab.rows.length).toBe(9);
    expect(fixture.nativeElement.querySelectorAll('.stitch').length).toBe(72);
  });
});
