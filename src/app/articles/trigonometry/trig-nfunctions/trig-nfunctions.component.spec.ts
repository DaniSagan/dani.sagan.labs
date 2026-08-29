import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { TrigNFunctionsComponent } from './trig-nfunctions.component';

describe('TrigNFunctionsComponent', () => {
  let component: TrigNFunctionsComponent;
  let fixture: ComponentFixture<TrigNFunctionsComponent>;

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
      imports: [TrigNFunctionsComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrigNFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
