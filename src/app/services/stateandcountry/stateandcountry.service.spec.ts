import { TestBed } from '@angular/core/testing';

import { StateandcountryService } from './stateandcountry.service';

describe('StateandcountryService', () => {
  let service: StateandcountryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StateandcountryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
