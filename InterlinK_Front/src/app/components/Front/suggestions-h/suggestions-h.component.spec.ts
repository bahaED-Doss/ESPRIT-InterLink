import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuggestionsHComponent } from './suggestions-h.component';

describe('SuggestionsHComponent', () => {
  let component: SuggestionsHComponent;
  let fixture: ComponentFixture<SuggestionsHComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SuggestionsHComponent]
    });
    fixture = TestBed.createComponent(SuggestionsHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
