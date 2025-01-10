import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoenixSetComponent } from './phoenix-set.component';

describe('PhoenixSetComponent', () => {
  let component: PhoenixSetComponent;
  let fixture: ComponentFixture<PhoenixSetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhoenixSetComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PhoenixSetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
