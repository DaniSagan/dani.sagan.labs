import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MengerSpongeComponent } from './menger-sponge.component';

describe('MengerSpongeComponent', () => {
  let component: MengerSpongeComponent;
  let fixture: ComponentFixture<MengerSpongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MengerSpongeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MengerSpongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
