import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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
  latitude: number;
  longitude: number;
  website?: string;  
  logoUrl?: string;  
  description?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8081/Interlink/company'; // Adjust if needed

  constructor(private http: HttpClient) {}

  createCompany(value: any) {
    throw new Error('Method not implemented.');
  }

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
    return this.http.put<Company>(`${this.apiUrl}/modify-company`, company);
  }

  deleteCompany(companyId: number): Observable<void> {
    console.log("Sending DELETE request for Company ID:", companyId);
    return this.http.delete<void>(`${this.apiUrl}/remove-company/${companyId}`);
  }

  // ✅ Fixed: Now uses `location` instead of `country` and `city`
  searchCompanies(params: { 
    industrySector?: string, 
    location?: string, 
    sortField?: string, 
    ascending?: boolean 
  }): Observable<Company[]> {
    let httpParams = new HttpParams();

    if (params.industrySector) httpParams = httpParams.set('industrySector', params.industrySector);
    if (params.location) httpParams = httpParams.set('location', params.location);
    if (params.sortField) httpParams = httpParams.set('sortField', params.sortField);
    if (params.ascending !== undefined) httpParams = httpParams.set('ascending', params.ascending.toString());

    return this.http.get<Company[]>(`${this.apiUrl}/search-companies`, { params: httpParams });
  }

  getProjectsPerCompany(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/projects-per-company`);
  }

  getCompaniesByIndustrySector(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/companies-by-industry-sector`);
  }
}