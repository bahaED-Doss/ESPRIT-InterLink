import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { UserService } from '../../Services/user.service';
import { NotificationService } from '../../Services/notification.service';

interface StudentSelection {
  studentId: number;
  projectId: number;
}

@Component({
  selector: 'app-select-student',
  templateUrl: './select-student.component.html',
  styleUrls: ['./select-student.component.css']
})
export class SelectStudentComponent implements OnInit {
  students: any[] = [];
  selectedStudentId: string = '';
  studentProjects: { [studentId: string]: any } = {};

  @Output() studentSelected = new EventEmitter<StudentSelection>();

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.userService.getStudents().subscribe({
      next: (data: any) => {
        this.students = data;
        console.log('Students loaded:', data);
        
        // Pre-load projects for all students
        this.students.forEach(student => {
          this.loadStudentProject(student.id);
        });
      },
      error: (error: any) => {
        console.error('Error loading students:', error);
      }
    });
  }

  loadStudentProject(studentId: number) {
    this.userService.getStudentProjects(studentId).subscribe({
      next: (data: any) => {
        if (data && data.length > 0) {
          this.studentProjects[studentId] = data[0]; // Assuming each student has only one project
          console.log(`Project loaded for student ${studentId}:`, data[0]);
        }
      },
      error: (error: any) => {
        console.error(`Error loading project for student ${studentId}:`, error);
      }
    });
  }

  onStudentChange() {
    if (this.selectedStudentId) {
      const studentId = Number(this.selectedStudentId);
      
      // Set the selected user ID in the notification service
      this.notificationService.setSelectedUser(studentId);
      
      // Start polling for notifications for this student
      this.notificationService.startPolling(studentId);
      
      const project = this.studentProjects[studentId];
      
      if (project) {
        console.log('Emitting student selection:', { 
          studentId, 
          projectId: project.projectId 
        });
        
        this.studentSelected.emit({ 
          studentId, 
          projectId: project.projectId 
        });
      } else {
        // If project not loaded yet, load it now
        this.loadStudentProject(studentId);
        // Emit with projectId 0, will be updated when project is loaded
        this.studentSelected.emit({ 
          studentId, 
          projectId: 0 
        });
      }
    }
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> cf28fa5 (integration front)
