import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { TrigInverseTrigCompositionComponent } from './trig-inverse-trig-composition.component';

describe('TrigInverseTrigCompositionComponent', () => {
  let component: TrigInverseTrigCompositionComponent;
  let fixture: ComponentFixture<TrigInverseTrigCompositionComponent>;

  beforeEach(async () => {
    (window as any).MathJax = {
      isReady: true,
      promise: Promise.resolve(),
      startup: {
        promise: Promise.resolve(),
        defaultReady: () => undefined,
        ready: () => undefined
      },
      typesetPromise: () => Promise.resolve()
    };

    await TestBed.configureTestingModule({
      imports: [TrigInverseTrigCompositionComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrigInverseTrigCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
