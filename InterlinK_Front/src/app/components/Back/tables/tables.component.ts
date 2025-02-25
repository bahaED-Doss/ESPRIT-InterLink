import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";

import { SettingsComponent } from "../settings/settings.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { NavBackComponent } from '../nav-back/nav-back.component';
import { Role, User } from 'src/app/models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common'; //
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [CommonModule,AsideComponent, NavBackComponent, SettingsComponent, FooterBackComponent,ReactiveFormsModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  users: User[] = [];
  addUserForm: FormGroup;
  editUserForm: FormGroup; 
  Role = Role;
  selectedUserType: Role | null = null;
  selectedUser: User | null = null;

  @ViewChild('chooseUserTypeModal', { read: TemplateRef }) chooseUserTypeModal!: TemplateRef<any>;
  @ViewChild('addUserModal', { read: TemplateRef }) addUserModal!: TemplateRef<any>;
  @ViewChild('editUserModal', { read: TemplateRef }) editUserModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    public modalService: NgbModal
  ) {
    this.addUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      levelOfStudy: [''],
      phoneNumber: [''],
      companyName: [''],
      companyIdentifier: [''],
      department: [''],
      yearsOfExperience: ['']
    });
    this.editUserForm = this.fb.group({
      id: [''], // Add this
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      levelOfStudy: [''],
      phoneNumber: [''],
      companyName: [''],
      companyIdentifier: [''],
      department: [''],
      yearsOfExperience: [''],
      role: [Role.STUDENT, Validators.required] // Add this
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  openAddUserModal(): void {
    this.modalService.open(this.chooseUserTypeModal);
  }
  openChooseUserTypeModal(): void {
    this.modalService.open(this.chooseUserTypeModal);
  }
   // Open the edit modal and populate it with the selected user's data
   openEditUserModal(user: User): void {
    console.log('Edit User Modal Opened for:', user); // Debugging
    this.selectedUser = user;
    this.editUserForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: '', // Password is optional for editing
      levelOfStudy: user.levelOfStudy,
      phoneNumber: user.phoneNumber,
      companyName: user.companyName,
      companyIdentifier: user.companyIdentifier,
      department: user.department,
      yearsOfExperience: user.yearsOfExperience,
      role: user.role
    });
    this.modalService.open(this.editUserModal); // Open the edit modal
  }
  onSubmitEditUser(): void {
    if (this.editUserForm.invalid) return;
  
    let updatedUser = this.editUserForm.value;
  
    // Clear out role-specific fields when the role is changed
    switch (updatedUser.role) {
      case Role.STUDENT:
        updatedUser = {
          ...updatedUser,
          companyName: null,
          companyIdentifier: null,
          department: null,
          yearsOfExperience: null
        };
        break;
      case Role.HR:
        updatedUser = {
          ...updatedUser,
          levelOfStudy: null,
          phoneNumber: null
        };
        break;
      case Role.PROJECT_MANAGER:
        updatedUser = {
          ...updatedUser,
          levelOfStudy: null,
          phoneNumber: null,
          companyName: null,
          companyIdentifier: null
        };
        break;
    }
  
    this.AuthService.updateUser(updatedUser.id, updatedUser).subscribe(
      () => {
        this.modalService.dismissAll();
        this.loadUsers(); // Refresh the user list
      },
      error => {
        console.error('Error updating user!', error);
      }
    );
  }
  


  selectUserType(userType: Role): void {
    this.selectedUserType = userType;
    this.modalService.dismissAll();
    this.modalService.open(this.addUserModal);
  }
  onSubmitAddUser(): void {
    if (this.addUserForm.invalid) return;
    const userData = { ...this.addUserForm.value, role: this.selectedUserType };
    this.AuthService.addUser(userData).subscribe(() => {
      this.modalService.dismissAll();
      this.addUserForm.reset();
      this.loadUsers();
    });
  }

  deleteUser(id: number) {
    this.AuthService.deleteUser(id).subscribe(
      () => {
        this.loadUsers();
      },
      error => {
        console.error('Error deleting user!', error);
      }
    );
  }

  loadUsers() {
    this.AuthService.getUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.error('Error loading users!', error);
      }
    );
  }

  editField(user: User, field: keyof User) {
    user[`editing${this.capitalize(field as string)}`] = true;
  }

  saveField(user: User, field: keyof User) {
    if (user.id === undefined) {
      console.error('User ID is undefined, cannot update user.');
      return;
    }

    (user as any)[`editing${this.capitalize(field as string)}`] = false;
    this.AuthService.updateUser(user.id, user).subscribe(
      () => {
        console.log(`${field} updated successfully!`);
      },
      error => {
        console.error(`Error updating ${field}!`, error);
      }
    );
  }

  capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}