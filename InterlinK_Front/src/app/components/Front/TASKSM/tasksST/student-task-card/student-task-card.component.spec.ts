import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentTaskCardComponent } from './student-task-card.component';

describe('StudentTaskCardComponent', () => {
  let component: StudentTaskCardComponent;
  let fixture: ComponentFixture<StudentTaskCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentTaskCardComponent]
    });
    fixture = TestBed.createComponent(StudentTaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
