
import { Component, Input, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { Sentiment , Feedback} from '../../models/feedback.model';

@Component({
  selector: 'app-sentiment-chart',
  templateUrl: './sentiment-chart.component.html',
  styleUrls: ['./sentiment-chart.component.css']
})
export class SentimentChartComponent implements OnInit {
  @Input() feedbacks: Feedback[] = [];
  chart: any;

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    if (this.chart) this.chart.destroy();
    
    const counts = this.countSentiments();
    
    this.chart = new Chart('sentimentChart', {
      type: 'bar',
      data: {
        labels: Object.values(Sentiment),
        datasets: [{
          data: [counts.POSITIVE, counts.NEUTRAL, counts.NEGATIVE],
          backgroundColor: [
            'rgba(75, 192, 192, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(255, 99, 132, 0.7)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } }
      }
    });
  }

  private countSentiments() {
    return this.feedbacks.reduce((acc, feedback) => {
      acc[feedback.sentiment]++;
      return acc;
    }, { POSITIVE: 0, NEUTRAL: 0, NEGATIVE: 0 });
  }

  ngOnDestroy() {
    if (this.chart) this.chart.destroy();
  }
}