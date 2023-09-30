import { TestBed } from '@angular/core/testing';

import { UpdateUserProfileServiceService } from './update-user-profile-service.service';

describe('UpdateUserProfileServiceService', () => {
  let service: UpdateUserProfileServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateUserProfileServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
