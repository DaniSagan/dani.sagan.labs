import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { ParabolaArticleComponent } from './parabola-article.component';

describe('ParabolaArticleComponent', () => {
  let component: ParabolaArticleComponent;
  let fixture: ComponentFixture<ParabolaArticleComponent>;

  beforeEach(async () => {
    (window as any).MathJax = {
      isReady: true,
      promise: Promise.resolve(),
      startup: {
        promise: Promise.resolve(),
        defaultReady: () => undefined
      },
      typesetPromise: () => Promise.resolve()
    };

    await TestBed.configureTestingModule({
      imports: [ParabolaArticleComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParabolaArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
