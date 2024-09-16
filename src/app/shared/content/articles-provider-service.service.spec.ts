import { TestBed } from '@angular/core/testing';

import { ArticlesProviderServiceService } from './articles-provider-service.service';

describe('ArticlesProviderServiceService', () => {
  let service: ArticlesProviderServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticlesProviderServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
