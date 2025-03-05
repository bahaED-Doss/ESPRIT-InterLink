import { Component, OnInit } from '@angular/core';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = []; // Full company list
  searchResults: Company[] = []; // Only for search results
  searchIndustrySector: string = '';
  selectedCountry: string = '';
  selectedCity: string = '';
  industrySectors: string[] = [];
  countries: string[] = [];
  cities: string[] = [];

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      console.log("API Response:", data);
      this.companies = data;
      this.extractFilterOptions();
    });
  }

  extractFilterOptions(): void {
    this.industrySectors = [...new Set(this.companies.map(c => c.industrySector))];
    this.countries = [...new Set(this.companies.map(c => c.country))];
    this.cities = [...new Set(this.companies.map(c => c.city))];
  }

  onCountryChange(event: Event): void {
    const selectedCountry = (event.target as HTMLSelectElement).value;
    this.selectedCountry = selectedCountry;
  
    this.cities = [...new Set(this.companies
      .filter(company => company.country === selectedCountry)
      .map(company => company.city))];
  
    if (!this.cities.includes(this.selectedCity)) {
      this.selectedCity = '';
    }
  
    this.onSearch(); // 🔥 Automatically trigger search
  }
  

  onSearch(): void {
    this.companyService.searchCompanies({
      industrySector: this.searchIndustrySector,
      country: this.selectedCountry,
      city: this.selectedCity,
      sortField: 'name',
      ascending: true
    }).subscribe(data => {
      this.searchResults = data; // Store search results
    });
  }

  deleteCompany(company: any): void {
    console.log("Deleting Company:", company); 
    console.log("Company ID:", company?.companyId);

    if (!company || !company.companyId) {
      console.error("Error: companyId is undefined.");
      return;
    }

    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.companyService.deleteCompany(company.companyId).subscribe({
        next: () => {
          alert(`${company.name} deleted successfully`);
          this.loadCompanies();
        },
        error: (err) => {
          console.error("Error deleting company:", err);
        }
      });
    }
  }
}
