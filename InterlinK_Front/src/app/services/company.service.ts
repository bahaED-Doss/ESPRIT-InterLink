import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Company {
  companyId?: number;
  name: string;
  location: string;
  email: string;
  city: string;
  country: string;
  phone: string;
  industrySector: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8081/Interlink/company'; // Adjust the URL if needed

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<Company[]> {
    return this.http.get<Company[]>(`${this.apiUrl}/retrieve-all-companies`);
  }

  getCompanyById(companyId: number): Observable<Company> {
    return this.http.get<Company>(`${this.apiUrl}/retrieve-company/${companyId}`);
  }

  addCompany(company: Company): Observable<Company> {
    return this.http.post<Company>(`${this.apiUrl}/add-company`, company);
  }

  updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/modify-company/${company.companyId}`, company);
  }
  

  deleteCompany(companyId: number): Observable<void> {
    console.log("Sending DELETE request for Company ID:", companyId); // 🔥 Log request
    return this.http.delete<void>(`${this.apiUrl}/remove-company/${companyId}`);
  }
  
  
  
}
