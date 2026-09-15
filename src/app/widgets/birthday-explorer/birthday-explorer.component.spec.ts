import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { BirthdayExplorerComponent } from './birthday-explorer.component';
describe('BirthdayExplorerComponent', () => {
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [BirthdayExplorerComponent] }).compileComponents(); });
  it('highlights repeated dates and resets statistics when the group changes', fakeAsync(() => {
    spyOn(Math, 'random').and.returnValue(0);
    const fixture = TestBed.createComponent(BirthdayExplorerComponent);
    const c = fixture.componentInstance; fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.repeated').length).toBe(23);
    c.run(); tick(1200); expect(c.trials).toBe(1000); expect(c.collisions).toBe(1000); expect(c.running).toBeFalse();
    c.preset(0); expect(c.trials).toBe(0); expect(c.birthdays).toEqual([]);
    fixture.destroy();
  }));
  it('cancels running batches on stop and destruction', fakeAsync(() => {
    const fixture = TestBed.createComponent(BirthdayExplorerComponent);
    const c = fixture.componentInstance;
    c.run(); tick(30); expect(c.trials).toBe(25);
    c.stop(); tick(100); expect(c.trials).toBe(25);
    c.run(); fixture.destroy(); tick(100); expect(c.trials).toBe(25);
  }));
});
