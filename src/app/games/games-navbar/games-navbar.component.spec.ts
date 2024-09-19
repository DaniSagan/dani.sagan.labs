import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesNavbarComponent } from './games-navbar.component';

describe('GamesNavbarComponent', () => {
  let component: GamesNavbarComponent;
  let fixture: ComponentFixture<GamesNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GamesNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GamesNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
