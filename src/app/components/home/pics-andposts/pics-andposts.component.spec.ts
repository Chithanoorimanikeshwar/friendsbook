import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PicsAndpostsComponent } from './pics-andposts.component';

describe('PicsAndpostsComponent', () => {
  let component: PicsAndpostsComponent;
  let fixture: ComponentFixture<PicsAndpostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PicsAndpostsComponent]
    });
    fixture = TestBed.createComponent(PicsAndpostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
