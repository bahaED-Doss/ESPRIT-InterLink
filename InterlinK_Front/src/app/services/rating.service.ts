import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RatingService {
  private ratingsKey = 'internship-ratings';

  getRatings(internshipId: number): { rating: number; comment?: string; date?: Date }[] {
    const ratingsJson = localStorage.getItem(this.ratingsKey) || '{}';
    const allRatings: Record<number, { rating: number; comment?: string; date?: Date }[]> = JSON.parse(ratingsJson);
    return allRatings[internshipId] || [];
  }

  addRating(internshipId: number, rating: number, comment?: string) {
    const ratingsJson = localStorage.getItem(this.ratingsKey) || '{}';
    const allRatings: Record<number, { rating: number; comment?: string; date?: Date }[]> = JSON.parse(ratingsJson);
    
    allRatings[internshipId] = allRatings[internshipId] || [];
    allRatings[internshipId].push({ rating, comment, date: new Date() });
    
    localStorage.setItem(this.ratingsKey, JSON.stringify(allRatings));
    return of({ success: true });
  }

  getAverageRating(internshipId: number): number {
    const ratings = this.getRatings(internshipId);
    if (!ratings.length) return 0;
    return ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
  }
}