import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MontyHallComponent } from './monty-hall.component';
describe('MontyHallComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [MontyHallComponent] }).compileComponents(); });
  it('keeps the prize hidden until the final choice and locks completed rounds', () => {
    const fixture = TestBed.createComponent(MontyHallComponent);
    const c = fixture.componentInstance; c.prize = 1; fixture.detectChanges();
    expect(c.label(1)).toBe('Cerrada'); c.choose(0); expect(c.round!.opened).toBe(2);
    c.choose(1); expect(c.round!.choice).toBe(0);
    c.finish(true); expect(c.finalChoice).toBe(1); c.finish(false); expect(c.finalChoice).toBe(1);
    fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('Has ganado');
    c.resetGame(); expect(c.round).toBeNull(); expect(c.finalChoice).toBeNull(); fixture.destroy();
  });
  it('runs paired trials and cancels timers', fakeAsync(() => {
    const fixture = TestBed.createComponent(MontyHallComponent);
    const c = fixture.componentInstance; c.run(); tick(1000);
    expect(c.trials).toBe(1000); expect(c.stayWins + c.switchWins).toBe(1000);
    c.run(); tick(25); c.stop(); const count = c.trials; tick(100); expect(c.trials).toBe(count);
    c.resetStats(); expect(c.trials).toBe(0); c.run(); fixture.destroy(); tick(100); expect(c.trials).toBe(0);
  }));
});
