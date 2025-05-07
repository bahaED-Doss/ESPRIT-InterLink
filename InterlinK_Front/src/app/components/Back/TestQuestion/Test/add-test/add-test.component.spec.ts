import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestComponent } from './add-test.component';

describe('AddTestComponent', () => {
  let component: AddTestComponent;
  let fixture: ComponentFixture<AddTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTestComponent]
    });
    fixture = TestBed.createComponent(AddTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
