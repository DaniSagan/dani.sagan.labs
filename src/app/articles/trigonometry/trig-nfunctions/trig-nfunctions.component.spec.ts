import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrigNFunctionsComponent } from './trig-nfunctions.component';

describe('TrigNFunctionsComponent', () => {
  let component: TrigNFunctionsComponent;
  let fixture: ComponentFixture<TrigNFunctionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrigNFunctionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrigNFunctionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
