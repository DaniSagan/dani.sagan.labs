import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SunPositionComponent } from './sun-position.component';

describe('SunPositionComponent', () => {
  let component: SunPositionComponent;
  let fixture: ComponentFixture<SunPositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SunPositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SunPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
