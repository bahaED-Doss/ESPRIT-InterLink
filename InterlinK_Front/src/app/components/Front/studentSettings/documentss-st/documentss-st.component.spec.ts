import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentssSTComponent } from './documentss-st.component';

describe('DocumentssSTComponent', () => {
  let component: DocumentssSTComponent;
  let fixture: ComponentFixture<DocumentssSTComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentssSTComponent]
    });
    fixture = TestBed.createComponent(DocumentssSTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
