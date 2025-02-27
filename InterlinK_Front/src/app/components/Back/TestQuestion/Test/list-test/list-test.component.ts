import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Test } from 'src/app/models/test';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-list-test',
  templateUrl: './list-test.component.html',
  styleUrls: ['./list-test.component.css'],
})
export class ListTestComponent implements OnInit {
  public selectedItem: Test | null = null;
  public data: any;
  private subscription: Subscription = new Subscription();

  constructor(
    public $TestService: TestService,
    private AuthService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchAllTest();
  }

  fetchAllTest() {
    this.subscription = this.$TestService.getAll().subscribe({
      next: (res: Test) => {
        this.data = res;
        console.log('Data', this.data);
      },
    });
  }

  users: User[] = [];
  loadUsers() {
    this.AuthService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error loading users!', error);
      }
    );
  }
}
