import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { MathjaxModule } from 'mathjax-angular';
import { CurveArticleComponent } from './curve-article.component';

describe('CurveArticleComponent', () => {
  let component: CurveArticleComponent;
  let fixture: ComponentFixture<CurveArticleComponent>;

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
      imports: [CurveArticleComponent, MathjaxModule.forRoot()],
      providers: [{
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            data: { curve: 'cardioid' },
            routeConfig: { path: 'cardioid' }
          }
        }
      }]
    }).compileComponents();

    fixture = TestBed.createComponent(CurveArticleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
