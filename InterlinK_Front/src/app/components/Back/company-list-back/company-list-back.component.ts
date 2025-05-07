import { Component, OnInit } from '@angular/core';
import { CompanyService, Company } from 'src/app/services/company.service';
import { EChartsOption } from 'echarts';
@Component({
  selector: 'app-company-list-back',
  templateUrl: './company-list-back.component.html',
  styleUrls: ['./company-list-back.component.css']
})
export class CompanyListBackComponent implements OnInit {
  companies: Company[] = []; // Full company list
  searchResults: Company[] = []; // Only for search results
  searchIndustrySector: string = '';
  selectedLocation: string = '';
  locations: string[] = [];
  selectedCountry: string = '';
  selectedCity: string = '';
  industrySectors: string[] = [];
  countries: string[] = [];
  cities: string[] = [];
  projectsPerCompany: { [key: string]: number } = {};
  companiesByIndustry: { [key: string]: number } = {};

  projectsChartOption: EChartsOption = {};
  industryChartOption: EChartsOption = {};

  // Google Map Configuration
  //mapCenter: google.maps.LatLngLiteral = { lat: 51.505, lng: -0.09 }; // Default center (Change it as needed)
  zoomLevel: number = 2; // Default zoom level

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.loadStatistics();
  }

  loadStatistics(): void {
    this.companyService.getProjectsPerCompany().subscribe(data => {
      console.log('Projects per Company Data:', data);

      if (data instanceof Map) {
        this.projectsPerCompany = Object.fromEntries(data as any); // Convert Map to Object
      } else {
        this.projectsPerCompany = data; // Assign directly if already an object
      }

      this.updateProjectsChart();
    });

    this.companyService.getCompaniesByIndustrySector().subscribe({
      next: (data) => {
        console.log('Companies by Industry Data:', data);

        if (data instanceof Map) {
          this.companiesByIndustry = Object.fromEntries(data as any);
        } else {
          this.companiesByIndustry = data;
        }

        this.updateIndustryChart();
      },
      error: (err) => {
        console.error('Error loading companies by industry:', err);
      }
    });
  }

  updateProjectsChart(): void {
    this.projectsChartOption = {
      title: { text: 'Projects per Company', left: 'center' },
      tooltip: { trigger: 'axis' },
      xAxis: { type: 'category', data: Object.keys(this.projectsPerCompany) },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: Object.values(this.projectsPerCompany) }]
    };
  }

  updateIndustryChart(): void {
    this.industryChartOption = {
      title: { text: 'Companies by Industry', left: 'center' },
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: '50%',
        data: Object.entries(this.companiesByIndustry).map(([name, value]) => ({ name, value }))
      }]
    };
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      console.log('API Response:', data);
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

    this.cities = [
      ...new Set(
        this.companies
          .filter((company) => company.country === selectedCountry)
          .map((company) => company.city)
      ),
    ];

    if (!this.cities.includes(this.selectedCity)) {
      this.selectedCity = '';
    }

    this.onSearch(); //  Automatically trigger search
  }

  onSearch(): void {
    this.companyService
      .searchCompanies({
        industrySector: this.searchIndustrySector,
        location: this.selectedLocation,
        sortField: 'name',
        ascending: true,
      })
      .subscribe((data) => {
        this.searchResults = data;
      });
  }

  deleteCompany(company: any): void {
    console.log('Deleting Company:', company);
    console.log('Company ID:', company?.companyId);

    if (!company || !company.companyId) {
      console.error('Error: companyId is undefined.');
      return;
    }

    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.companyService.deleteCompany(company.companyId).subscribe({
        next: () => {
          alert(`${company.name} deleted successfully`);
          this.loadCompanies();
          this.loadStatistics();
        },
        error: (err) => {
          console.error('Error deleting company:', err);
        },
      });
    }
  }
}