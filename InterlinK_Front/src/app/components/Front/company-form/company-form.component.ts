import { Component } from '@angular/core';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent {
  company: Company = { name: '', location: '', email: '', phone: '' };

  constructor(private companyService: CompanyService) {}

  submitForm(): void {
    if (this.company.id) {
      this.companyService.updateCompany(this.company).subscribe(() => {
        alert('Company updated successfully');
      });
    } else {
      this.companyService.addCompany(this.company).subscribe(() => {
        alert('Company added successfully');
      });
    }
  }
}
