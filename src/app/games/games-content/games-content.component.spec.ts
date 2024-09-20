import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GamesContentComponent } from './games-content.component';
import { ActivatedRoute } from '@angular/router';
import { MathjaxModule } from 'mathjax-angular';

const fakeActivatedRoute = {
  snapshot: { data: { } }
} as ActivatedRoute;

describe('GamesContentComponent', () => {
  let component: GamesContentComponent;
  let fixture: ComponentFixture<GamesContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GamesContentComponent, MathjaxModule.forRoot()],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}]
    }).compileComponents();

    fixture = TestBed.createComponent(GamesContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
