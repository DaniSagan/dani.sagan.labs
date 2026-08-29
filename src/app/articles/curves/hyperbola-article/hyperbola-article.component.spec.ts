import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { HyperbolaArticleComponent } from './hyperbola-article.component';

describe('HyperbolaArticleComponent', () => {
  let component: HyperbolaArticleComponent;
  let fixture: ComponentFixture<HyperbolaArticleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperbolaArticleComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

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

    fixture = TestBed.createComponent(HyperbolaArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
