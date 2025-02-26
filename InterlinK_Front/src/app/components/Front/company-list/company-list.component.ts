import { Component, OnInit,  } from '@angular/core';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.css']
})
export class CompanyListComponent implements OnInit {
  companies: Company[] = [];

  constructor(private companyService: CompanyService) {}

  ngOnInit(): void {
    this.loadCompanies();
  }

  loadCompanies(): void {
    this.companyService.getAllCompanies().subscribe(data => {
      console.log("API Response:", data); // Debugging step
      this.companies = data;
    });
  }
  

  deleteCompany(company: any): void {
    console.log("Deleting Company:", company); // 🔥 Check what is passed
    console.log("Company ID:", company?.companyId); // 🔥 Log the ID
  
    if (!company || !company.companyId) {
      console.error("Error: companyId is undefined.");
      return;
    }
  
    if (confirm(`Are you sure you want to delete ${company.name}?`)) {
      this.companyService.deleteCompany(company.companyId).subscribe({
        next: () => {
          alert(`${company.name} deleted successfully`);
          this.loadCompanies(); // Refresh list
        },
        error: (err) => {
          console.error("Error deleting company:", err);
        }
      });
    }
  }

  
  
  
}
