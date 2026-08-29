import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathjaxModule } from 'mathjax-angular';

import { AgnesiWitchArticleComponent } from './agnesi-witch-article.component';

describe('AgnesiWitchArticleComponent', () => {
  let component: AgnesiWitchArticleComponent;
  let fixture: ComponentFixture<AgnesiWitchArticleComponent>;

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
      imports: [AgnesiWitchArticleComponent, MathjaxModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgnesiWitchArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
