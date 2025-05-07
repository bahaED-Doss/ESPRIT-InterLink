import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackChartModalComponent } from './feedback-chart-modal.component';

describe('FeedbackChartModalComponent', () => {
  let component: FeedbackChartModalComponent;
  let fixture: ComponentFixture<FeedbackChartModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackChartModalComponent]
    });
    fixture = TestBed.createComponent(FeedbackChartModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
