import { TestBed } from '@angular/core/testing';

import { CompserviceService } from './compservice.service';

describe('CompserviceService', () => {
  let service: CompserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
