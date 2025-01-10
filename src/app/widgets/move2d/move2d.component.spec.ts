import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Move2DComponent } from './move2d.component';

describe('Move2DComponent', () => {
  let component: Move2DComponent;
  let fixture: ComponentFixture<Move2DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Move2DComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Move2DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
