// task-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../Services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  @Input() taskModel: Task = this.getEmptyTask();
  @Input() isEditing: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() selectedProjectId!: number;
  @Input() selectedManagerId!: number;
  
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Task>();
  
  taskForm!: FormGroup;
  
  constructor(private fb: FormBuilder,
      private taskService: TaskService
  ) {}
  
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.taskForm = this.fb.group({
      title: ['', Validators.required,Validators.minLength(3)],
      description: ['', Validators.required,Validators.minLength(10)],
      deadline: ['', Validators.required],
      priority: ['MEDIUM', Validators.required]
    });
    this.taskForm.valueChanges.subscribe(val => {
      console.log('Form values changed:', val);
      console.log('Form status:', this.taskForm.status);
      console.log('Form errors:', this.getFormValidationErrors());
    });
  }

  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.taskForm.controls).forEach(key => {
      const control = this.taskForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
  
  getEmptyTask(): Task {
    return {
      title: '',
      description: '',
      deadline: new Date(),
      priority: 'MEDIUM',
      projectManager: {
        id: this.selectedManagerId
      },
      project: {
        projectId: this.selectedProjectId
      },
      status: 'TO_DO',
      timer: 0,
      student: null,
      feedbacks: []
    };
  }
  
  onClose() {
    this.close.emit();
    this.taskForm.reset();
  }
  
  onSubmit() {
    console.log('Form submitted');
    console.log('Form state:', {
      valid: this.taskForm.valid,
      pristine: this.taskForm.pristine,
      touched: this.taskForm.touched,
      values: this.taskForm.value
    });

    if (this.taskForm.valid) {
      const task: Task = {
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        deadline: new Date(this.taskForm.value.deadline),
        priority: this.taskForm.value.priority,
        projectManager: { id: this.selectedManagerId },
        project: { projectId: this.selectedProjectId },
        status: 'TO_DO',
        timer: 0
      };
      
      console.log('Emitting task:', task);
      this.save.emit(task);
      this.close.emit();
    }
  }
}