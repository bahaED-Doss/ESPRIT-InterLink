import { Component, Input, OnChanges, SimpleChanges, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent implements OnInit, OnChanges {
  @Input() selectedCompany: Company | null = null;
  addCompany!: FormGroup;
  countries: string[] = [];
  cities: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = ''; // This is the correct property for city
  searchKeyword: string = '';
  searchLocation: string = '';
  searchIndustrySector: string = '';

  @ViewChild('companyForm') companyForm!: ElementRef;

  industrySectors: string[] = [
    'Technology', 'Finance', 'Healthcare', 'Education', 'Retail',
    'Manufacturing', 'Construction', 'Real Estate', 'Transportation', 'Energy'
  ];

  companies: Company[] = []; // Add companies array to hold search results

  constructor(private companyService: CompanyService, private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.addCompany = this.fb.group({
      companyId: [''],
      name: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      city: ['', [
        Validators.required,
        Validators.pattern('^[a-zA-Z\s]+$')
      ]],
      country: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{8,15}$')]],
      industrySector: ['', [Validators.required]]
    });

    this.loadCountries();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedCompany'] && this.selectedCompany) {
      this.addCompany.patchValue(this.selectedCompany);
      setTimeout(() => {
        this.companyForm?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }

  loadCountries(): void {
    this.http.get<any[]>('https://restcountries.com/v3.1/all').subscribe(data => {
      this.countries = data.map(country => country.name.common).sort();
    });
  }

  loadCities(): void {
    if (!this.selectedCountry) return;

    this.http.get<any[]>(`https://api.teleport.org/api/countries/${this.selectedCountry}/cities/`).subscribe(
      data => {
        this.cities = data.map((city: { name: string }) => city.name);
      },
      error => {
        console.error("Error loading cities", error);
      }
    );
  }

  onCountryChange(event: any): void {
    this.selectedCountry = event.target.value;
    this.loadCities(); // Trigger cities load on country change
  }

  onSearch() {
    const params = {
      industrySector: this.searchIndustrySector,
      country: this.selectedCountry,
      city: this.selectedCity,
      keyword: this.searchKeyword
    };

    this.companyService.searchCompanies(params).subscribe(
      (companies) => {
        this.companies = companies; // Populate the companies array with search results
        console.log('Search results:', companies);
      },
      (error) => {
        console.error('Error searching companies:', error);
      }
    );
  }

  get f() {
    return this.addCompany.controls;
  }
  scrollToAddCompany() {
    const addCompanySection = document.getElementById('addCompanySection');
    if (addCompanySection) {
      addCompanySection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitForm() {
    if (this.addCompany.valid) {
      // Send data to backend
      this.companyService.addCompany(this.addCompany.value).subscribe(
        (response) => {
          console.log('Company added successfully:', response);
          alert('Company added successfully!');
  
          // Optionally, reset the form after successful submission
          this.addCompany.reset();
  
          // Reload the page after a successful submission
          window.location.reload();
        },
        (error) => {
          console.error('Error adding company:', error);
        }
      );
    } else {
      console.log('Form is invalid');
    }
  }
  
}
