import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {

  private apiUrl = 'http://localhost:8081/api/documents';

  constructor(private http: HttpClient) { }

  getDocuments(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user/1`);  // Replace 1 with dynamic user ID
  }

  uploadDocument(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${documentId}`);
  }
  generateDefaultDocument(documentType: string, studentFullName: string,studentClass: string): Observable<Blob> {
    const params = new HttpParams()
      .set('documentType', documentType)
      .set('studentFullName', studentFullName)
      .set('studentClass', studentClass);
    return this.http.get(`${this.apiUrl}/generate`, { params, responseType: 'blob' });
  }

  // For Lettre d'affectation (POST because we pass many params)
  generateLetterOfAssignment(data: {
    studentFullName: string,
    className: string,
    companyName: string,
    companyAddress: string,
    companyEmail: string,
    companyPhone: string,
    stagePeriod: string,
    stageStartDate: string,  // Add this line
    stageEndDate: string    // Add this line
}): Observable<Blob> {
    const params = new HttpParams()
      .set('studentFullName', data.studentFullName)
      .set('className', data.className)
      .set('companyName', data.companyName)
      .set('companyAddress', data.companyAddress)
      .set('companyEmail', data.companyEmail)
      .set('companyPhone', data.companyPhone)
      .set('stagePeriod', data.stagePeriod)
      .set('stageStartDate', data.stageStartDate)  // Pass the start date
      .set('stageEndDate', data.stageEndDate);    // Pass the end date
    return this.http.post(`${this.apiUrl}/letterOfAssignment`, null, { params, responseType: 'blob' });
}
}
