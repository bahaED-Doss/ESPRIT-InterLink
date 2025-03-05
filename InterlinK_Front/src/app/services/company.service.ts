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
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:8081/Interlink/company'; // Adjust the URL if needed

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
    console.log("Sending DELETE request for Company ID:", companyId); // 🔥 Log request
    return this.http.delete<void>(`${this.apiUrl}/remove-company/${companyId}`);
  }

  // New searchCompanies method
  searchCompanies(params: { industrySector?: string, country?: string, city?: string, sortField?: string, ascending?: boolean }): Observable<Company[]> {
    let httpParams = new HttpParams();

    if (params.industrySector) httpParams = httpParams.set('industrySector', params.industrySector);
    if (params.country) httpParams = httpParams.set('country', params.country);
    if (params.city) httpParams = httpParams.set('city', params.city);
    if (params.sortField) httpParams = httpParams.set('sortField', params.sortField);
    if (params.ascending !== undefined) httpParams = httpParams.set('ascending', params.ascending.toString());

    return this.http.get<Company[]>(`${this.apiUrl}/search-companies`, { params: httpParams });
}
    // Fetch Projects Per Company
    getProjectsPerCompany(): Observable<Map<string, number>> {
      return this.http.get<Map<string, number>>(`${this.apiUrl}/projects-per-company`);
    }

    // Fetch Companies By Industry Sector
    getCompaniesByIndustrySector(): Observable<Map<string, number>> {
      return this.http.get<Map<string, number>>(`${this.apiUrl}/companies-by-industry-sector`);
    }

}
