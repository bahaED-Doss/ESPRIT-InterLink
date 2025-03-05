import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInterviewComponent } from './view-interview.component';

describe('ViewInterviewComponent', () => {
  let component: ViewInterviewComponent;
  let fixture: ComponentFixture<ViewInterviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewInterviewComponent]
    });
    fixture = TestBed.createComponent(ViewInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
