import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesContentComponent } from './articles-content.component';
import { ActivatedRoute } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: { data: {} }
} as ActivatedRoute;

describe('ArticlesContentComponent', () => {
  let component: ArticlesContentComponent;
  let fixture: ComponentFixture<ArticlesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesContentComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticlesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
