import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesNavbarComponent } from './games-navbar.component';
import { ActivatedRoute, RouterModule } from '@angular/router';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('GamesNavbarComponent', () => {
  let component: GamesNavbarComponent;
  let fixture: ComponentFixture<GamesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesNavbarComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();

    fixture = TestBed.createComponent(GamesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
