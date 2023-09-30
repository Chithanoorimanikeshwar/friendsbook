import { TestBed } from '@angular/core/testing';

import { FotgetpasswordService } from './fotgetpassword.service';

describe('FotgetpasswordService', () => {
  let service: FotgetpasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FotgetpasswordService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
