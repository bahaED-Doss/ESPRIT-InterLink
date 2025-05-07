import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/UserS/auth.service';

@Component({
  selector: 'app-student-profile',
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent {
  user: any;
  studentId!: string;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    console.log("Logged-in student ID:", this.studentId);
    this.authService.getUserById(id).subscribe((user) => {
      this.user = user;
    });
  }

}
