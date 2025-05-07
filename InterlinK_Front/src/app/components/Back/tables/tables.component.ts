import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AsideComponent } from "../aside/aside.component";

import { SettingsComponent } from "../settings/settings.component";
import { FooterBackComponent } from "../footer-back/footer-back.component";
import { NavBackComponent } from '../nav-back/nav-back.component';
import { Role, User } from 'src/app/models/user';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/UserS/auth.service';
import { CommonModule } from '@angular/common'; //
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [RouterOutlet, NgxPaginationModule , RouterLink, RouterLinkActive, CommonModule,AsideComponent, NavBackComponent, SettingsComponent, FooterBackComponent,ReactiveFormsModule , FormsModule],
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.css']
})
export class TablesComponent implements OnInit {
  users: User[] = [];
  addUserForm: FormGroup;
  filteredUsers: User[] = [];
  editUserForm: FormGroup; 
  searchTerm: string = '';
  selectedRoleFilter: string = '';
  Role = Role;
  selectedUserType: Role | null = null;
  selectedUser: User | null = null;
   // Pagination
   page: number = 1;
   itemsPerPage: number = 10;

  @ViewChild('chooseUserTypeModal', { read: TemplateRef }) chooseUserTypeModal!: TemplateRef<any>;
  @ViewChild('addUserModal', { read: TemplateRef }) addUserModal!: TemplateRef<any>;
  @ViewChild('editUserModal', { read: TemplateRef }) editUserModal!: TemplateRef<any>;

  constructor(
    private fb: FormBuilder,
    private AuthService: AuthService,
    public modalService: NgbModal
  ) {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[!@#$%^&*]).+$') // at least one special character
      ]],
      levelOfStudy: [''],
      phoneNumber: ['', [Validators.pattern('^\\d{8}$')]],  // exactly 8 digits
      companyName: [''],
      companyIdentifier: ['', [Validators.pattern('^\\d{8}$')]], // exactly 8 digits
      department: [''],
      yearsOfExperience: ['', [Validators.pattern('^\\d{1,2}$')]]  // 1 to 2 digits max
    });
    this.editUserForm = this.fb.group({
      id: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern('^(?=.*[!@#$%^&*]).+$') // at least one special character
      ]], // Optional field for updating password
      levelOfStudy: [''],
      phoneNumber: ['', [Validators.pattern('^\\d{8}$')]],
      companyName: [''],
      companyIdentifier: ['', [Validators.pattern('^\\d{8}$')]],
      department: [''],
      yearsOfExperience: ['', [Validators.pattern('^\\d{1,2}$')]],
      role: [Role.STUDENT, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }
  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.toLowerCase();
      const email = (user.email ?? '').toLowerCase();
      const searchTerm = this.searchTerm.toLowerCase();
      const searchMatch = fullName.includes(searchTerm) || email.includes(searchTerm);
      const roleMatch = this.selectedRoleFilter ? user.role === this.selectedRoleFilter : true;
      return searchMatch && roleMatch;
    });
    // Réinitialiser à la première page après filtrage
    this.page = 1;
  }
  toggleBlockUser(user: User): void {
    // If user.enabled is undefined, we treat it as true (unblocked state).
    const block = user.enabled !== undefined ? user.enabled : false;  // Default to false if undefined
  
    // Send request to block or unblock
    this.AuthService.blockUser(user.id!, block).subscribe({
      next: (response: any) => {
        // e.g. { message: "User blocked successfully" }
        alert(response.message);
        // Flip the local user.enabled
        user.enabled = !user.enabled;
      },
      error: (err) => {
        console.error('Error updating block status:', err);
        alert('Error updating block status');
      }
    });
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
        this.filteredUsers = data; // Initialisation
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