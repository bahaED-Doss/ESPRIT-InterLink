import { Component, OnInit } from '@angular/core';
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
      console.log("Companies received from API:", data); // Debugging
      this.companies = data;
    });
  }
  

  deleteCompany(id?: number): void {
    console.log("Delete button clicked. ID:", id); // Debugging

    if (id === undefined) {
      console.error("Error: Company ID is undefined.");
      return;
    }

    if (confirm('Are you sure you want to delete this company?')) {
      this.companyService.deleteCompany(id).subscribe({
        next: () => {
          console.log(`Company with ID ${id} deleted successfully.`);
          this.loadCompanies(); // Refresh the list
        },
        error: (err) => {
          console.error("Error deleting company:", err);
        }
      });
    }
  }
}
