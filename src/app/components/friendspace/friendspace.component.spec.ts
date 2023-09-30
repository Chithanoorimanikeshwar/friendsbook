import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendspaceComponent } from './friendspace.component';

describe('FriendspaceComponent', () => {
  let component: FriendspaceComponent;
  let fixture: ComponentFixture<FriendspaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FriendspaceComponent]
    });
    fixture = TestBed.createComponent(FriendspaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
