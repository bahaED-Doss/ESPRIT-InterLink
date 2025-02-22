import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit, OnChanges {
  @Input() selectedCompany: Company | null = null; // Receive company to edit
  addCompany: FormGroup;
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';

  industrySectors: string[] = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Construction', 'Real Estate', 'Transportation', 'Energy'
  ];

  constructor(private companyService: CompanyService, private fb: FormBuilder, private http: HttpClient) {
    this.addCompany = this.fb.group({
      companyId: [''], // Include ID for updating
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
  }

  // Detects when a company is selected for editing
  ngOnChanges(changes: SimpleChanges): void {
    if (this.selectedCompany) {
      this.addCompany.patchValue(this.selectedCompany);
      console.log("Editing Company:", this.selectedCompany);
    }
  }

  // Load country list from API
  loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }

  // Fetch cities based on the selected country
  onCountryChange(event: any): void {
    this.selectedCountry = event.target.value;

    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      const country = data.find(c => c.name.common === this.selectedCountry);
      if (country && country.cca2) {
        const countryCode = country.cca2;

        this.http.get<any>(`http://api.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=50&username=demo`)
          .subscribe(response => {
            this.cities = response.geonames.map((city: { name: string }) => city.name);
            console.log("Cities loaded:", this.cities);
          }, error => {
            console.error("Error loading cities:", error);
          });
      }
    });
  }

  submitForm(): void {
    console.log("Submit Button Clicked");
    console.log("Form Data Before Submit:", this.addCompany.value);
  
    if (this.addCompany.valid) {
      if (this.addCompany.value.companyId) {
        console.log("Updating company..."); // 🔥 Check if update logic runs
        this.companyService.updateCompany(this.addCompany.value).subscribe(response => {
          alert('Company updated successfully');
          window.location.reload(); // Refresh page
        }, error => {
          console.error("Error updating company:", error);
        });
      } else {
        console.log("Adding new company..."); // 🔥 Check if add logic runs
        this.companyService.addCompany(this.addCompany.value).subscribe(response => {
          alert('Company added successfully');
          window.location.reload(); // Refresh page
        }, error => {
          console.error("Error adding company:", error);
        });
      }
    } else {
      alert('Please fill all required fields');
    }
  }
  
}
