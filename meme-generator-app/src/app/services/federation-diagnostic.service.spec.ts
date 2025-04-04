import { TestBed } from '@angular/core/testing';

import { FederationDiagnosticService } from './federation-diagnostic.service';

describe('FederationDiagnosticService', () => {
  let service: FederationDiagnosticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FederationDiagnosticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
