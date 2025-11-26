import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrigInverseTrigCompositionComponent } from './trig-inverse-trig-composition.component';

describe('TrigInverseTrigCompositionComponent', () => {
  let component: TrigInverseTrigCompositionComponent;
  let fixture: ComponentFixture<TrigInverseTrigCompositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrigInverseTrigCompositionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TrigInverseTrigCompositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
