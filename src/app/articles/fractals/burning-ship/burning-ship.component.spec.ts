import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurningShipComponent } from './burning-ship.component';

describe('BurningShipComponent', () => {
  let component: BurningShipComponent;
  let fixture: ComponentFixture<BurningShipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ providers: [provideRouter([])],
      imports: [BurningShipComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BurningShipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
