import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../Services/task.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html'
})
export class TaskManagementComponent implements OnInit {
  selectedManagerId: number = 0;
  selectedProjectId: number = 0;
  tasks: Task[] = [];
  newTask: Task = this.getEmptyTask();
  isEditing: boolean = false;
  isDrawerOpen: boolean = false;

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {}

  onProjectSelected(event: {projectId: number, managerId: number}) {
    this.selectedProjectId = event.projectId;
    this.selectedManagerId = event.managerId;
    if (this.selectedProjectId > 0) {
      this.loadTasks();
    }
  }

  loadTasks() {
    this.taskService.getTasks(this.selectedProjectId).subscribe({
      next: (data) => {
        this.tasks = data;
        console.log('Tasks loaded:', data);
      },
      error: (error) => console.error('Error loading tasks:', error)
    });
  }

  openCreateTaskDrawer() {
    if (this.selectedProjectId > 0) {
      this.newTask = this.getEmptyTask();
      this.isEditing = false;
      this.isDrawerOpen = true;
    }
  }

  closeTaskDrawer() {
    this.isDrawerOpen = false;
    this.loadTasks();
  }

  saveTask(task: Task) {
    console.log('Saving task:', task);
    
    this.taskService.createTask(
      this.selectedProjectId,
      this.selectedManagerId,
      task
    ).subscribe({
      next: (response) => {
        console.log('Task created:', response);
        this.loadTasks();
        this.closeTaskDrawer();
      },
      error: (error) => {
        console.error('Error details:', error.error);
      }
    });
  }

  createTask(task: Task) {
    alert("✅ Task created successfully! The student will receive an email & a calendar notification.");
  this.taskService.createTask(
    this.selectedProjectId,
    this.selectedManagerId,
    
    task
  ).subscribe({
    next: (response) => {
      this.loadTasks();
      this.closeTaskDrawer();
    },
    error: (error) => {
      console.error('Error creating task:', error);
      
    }
  });
}

  getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'Second_Level',
      projectManager: {
        id: this.selectedManagerId
      },
      project: {
        projectId: this.selectedProjectId
      },
      status: 'TO_DO',
      timer: 0
    };
  }


  deleteTask(taskId: number) {
    this.taskService.deleteTask(
      this.selectedProjectId, 
      taskId, 
      this.selectedManagerId
    ).subscribe({
      next: () => {
        this.loadTasks(); // Reload after deletion
      },
      error: (error) => console.error('Error deleting task:', error)
    });
  }


  openEditTaskDrawer(task: Task) {
    console.log('Opening edit drawer for task:', task);
    this.newTask = { ...task };
    this.isEditing = true;
    this.isDrawerOpen = true;
  }

  updateTask(task: Task) {
    console.log('Updating task:', task);
    this.taskService.updateTaskStatus(
      this.selectedProjectId,
      task.taskId!,
      this.selectedManagerId,
      task.status || 'TO_DO'
    ).subscribe({
      next: (updatedTask) => {
        console.log('Task updated:', updatedTask);
        const index = this.tasks.findIndex(t => t.taskId === updatedTask.taskId);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.loadTasks();
        this.closeTaskDrawer();
      },
      error: (error) => {
        console.error('Error updating task:', error);
        console.error('Error details:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
      }
    });
  }
}