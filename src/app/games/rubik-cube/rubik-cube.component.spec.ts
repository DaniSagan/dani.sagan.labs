import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RubikCubeComponent } from './rubik-cube.component';
describe('Rubik cube controls', () => {
  let fixture: ComponentFixture<RubikCubeComponent>,
    component: RubikCubeComponent;
  beforeEach(async () => {
    spyOn(RubikCubeComponent.prototype, 'ngAfterViewInit').and.stub();
    await TestBed.configureTestingModule({
      imports: [RubikCubeComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(RubikCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('provides six faces and an accessible keyboard canvas', () => {
    expect(fixture.nativeElement.querySelectorAll('.face-row').length).toBe(6);
    expect(
      fixture.nativeElement.querySelector('canvas').getAttribute('tabindex'),
    ).toBe('0');
    expect(
      fixture.nativeElement.querySelector('canvas').getAttribute('aria-label'),
    ).toContain('Teclado');
  });
  it('prevents overlapping moves while leaving camera controls available', () => {
    component.turn('R');
    fixture.detectChanges();
    expect(component.busy).toBe(true);
    expect(component.remaining).toBe(1);
    expect(
      [...fixture.nativeElement.querySelectorAll('.turn')].every(
        (b: any) => b.disabled,
      ),
    ).toBe(true);
    expect(
      fixture.nativeElement.querySelector('.zoom-controls button').disabled,
    ).toBe(false);
    component.scramble();
    expect(component.remaining).toBe(1);
  });
  it('queues 20 legal scramble moves', () => {
    component.scramble();
    expect(component.remaining).toBe(20);
  });
  it('maps inverse keyboard turns', () => {
    const turn = spyOn(component, 'turn');
    component.keyboard(
      new KeyboardEvent('keydown', { key: 'R', shiftKey: true }),
    );
    expect(turn).toHaveBeenCalledWith('R', true);
  });
});
