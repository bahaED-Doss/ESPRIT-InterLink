import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'; // Added Validators import
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
    // Add validators to the form controls
    this.companyForm = this.fb.group({
      companyId: [''],
      name: ['', [Validators.required, Validators.minLength(3)]], // Name is required with min length 3
      location: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]], // Email validation
      city: ['', [Validators.required, Validators.pattern('^[a-zA-Z\s]+$')]], // Only allows letters and spaces
      country: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]], // Phone number validation
      industrySector: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCountries();
    const companyId = this.route.snapshot.paramMap.get('id');
    if (companyId) {
      this.loadCompany(Number(companyId));
    }
  }

  loadCompany(id: number): void {
    this.companyService.getCompanyById(id).subscribe(data => {
      this.companyForm.patchValue(data);
      this.loadCities(data.country);
    });
  }

  loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }

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

  // Convenience getter for form fields
  get f() {
    return this.companyForm.controls;
  }
}