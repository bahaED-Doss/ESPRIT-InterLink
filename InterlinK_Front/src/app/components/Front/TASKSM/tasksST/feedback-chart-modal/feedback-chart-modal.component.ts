
import { Component, Input } from '@angular/core';
import { Sentiment , Feedback} from '../../models/feedback.model';

@Component({
  selector: 'app-feedback-chart-modal',
  templateUrl: './feedback-chart-modal.component.html',
  styleUrls: ['./feedback-chart-modal.component.css']
})
export class FeedbackChartModalComponent {
  @Input() feedbacks: Feedback[] = [];
  isOpen = false;

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }
}