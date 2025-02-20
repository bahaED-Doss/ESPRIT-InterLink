import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CompanyService, Company } from 'src/app/services/company.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.css']
})
export class CompanyFormComponent {
  [x: string]: any;
  addCompany: FormGroup;

  constructor(private companyService: CompanyService, private fb: FormBuilder) {
    this.addCompany = this.fb.group({
      name: [''],
      location: [''],
      email: [''],
      phone: ['']
    });
  }

  submitForm(): void {
    console.log("Form Data Before Submit:", this.addCompany.value); // Debugging step

    if (this.addCompany.valid) {
      this.companyService.addCompany(this.addCompany.value).subscribe(response => {
        console.log("Server Response:", response); // Debugging response
        alert('Company added successfully');
        this['loadCompanies'](); // Refresh list after deletion

      });
    } else {
      alert('Please fill all required fields');
    }
  }
}
