import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistertionComponent } from './registertion.component';

describe('RegistertionComponent', () => {
  let component: RegistertionComponent;
  let fixture: ComponentFixture<RegistertionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistertionComponent]
    });
    fixture = TestBed.createComponent(RegistertionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
