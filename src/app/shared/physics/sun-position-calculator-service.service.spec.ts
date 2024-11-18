import { TestBed } from '@angular/core/testing';

import { SunPositionCalculatorService } from './sun-position-calculator-service.service';

describe('SunPositionCalculatorServiceService', () => {
  let service: SunPositionCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SunPositionCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
