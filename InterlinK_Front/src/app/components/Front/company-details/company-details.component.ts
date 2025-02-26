import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-details',
  templateUrl: './company-details.component.html',
  styleUrls: ['./company-details.component.css']
})
export class CompanyDetailsComponent implements OnInit {
  companyForm: FormGroup;
  countries: string[] = [];
  cities: string[] = [];
  industrySectors: string[] = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Construction', 'Real Estate', 'Transportation', 'Energy'
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      companyId: [''],
      name: [''],
      location: [''],
      email: [''],
      city: [''],
      country: [''],
      phone: [''],
      industrySector: ['']
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.loadCompany(Number(companyId));
    }
  }

  // Load company details for editing
  loadCompany(id: number): void {
    this.companyService.getCompanyById(id).subscribe(data => {
      this.companyForm.patchValue(data);
      this.loadCities(data.country);
    });
  }

  // Load list of countries
  loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }

  // Load cities based on selected country
  onCountryChange(event: any): void {
    const selectedCountry = event.target.value;
    this.loadCities(selectedCountry);
  }

  loadCities(country: string): void {
    this.http.get<any[]>(`https://api.api-ninjas.com/v1/city?country=${country}`, {
      headers: { 'X-Api-Key': 'YOUR_API_KEY_HERE' } // Replace with an actual API key
    }).subscribe(response => {
      this.cities = response.map(city => city.name);
    });
  }

  // Save the updated company details
  updateCompany(): void {
    if (this.companyForm.valid) {
      this.companyService.updateCompany(this.companyForm.value).subscribe(() => {
        alert('Company updated successfully');
        this.router.navigate(['/company-list']); // Redirect after update
      });
    } else {
      alert('Please fill all required fields');
    }
  }
}
