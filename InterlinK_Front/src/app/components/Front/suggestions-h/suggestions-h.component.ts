import { Component } from '@angular/core';
import { RecommendationService } from 'src/app/services/recommendation.service';

@Component({
  selector: 'app-suggestions-h',
  templateUrl: './suggestions-h.component.html',
  styleUrls: ['./suggestions-h.component.css']
})
export class SuggestionsHComponent {
  recommendations: any[] = [];
  constructor(private recommendationService: RecommendationService) {}

showRecommendations = false; // toggle visibility

ngOnInit(): void {
  // Load recommendations early if you want
  this.getInternshipRecommendations(['Python', 'Machine Learning']);
}

getInternshipRecommendations(skills: string[]) {
  this.recommendationService.getRecommendations(skills).subscribe(data => {
    this.recommendations = data;
  });
}

toggleRecommendations() {
  this.showRecommendations = !this.showRecommendations;
}



}
