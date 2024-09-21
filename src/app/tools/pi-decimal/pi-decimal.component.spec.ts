import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiDecimalComponent } from './pi-decimal.component';

describe('PiDecimalComponent', () => {
  let component: PiDecimalComponent;
  let fixture: ComponentFixture<PiDecimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiDecimalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiDecimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
