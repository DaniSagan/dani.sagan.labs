import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesNavbarComponent } from './articles-navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('ArticlesNavbarComponent', () => {
  let component: ArticlesNavbarComponent;
  let fixture: ComponentFixture<ArticlesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticlesNavbarComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArticlesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
