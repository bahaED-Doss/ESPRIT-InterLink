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
  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();
  

  
  taskForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      deadline: ['', Validators.required],
      priority: ['LOW'],
      status: ['TO_DO']
    });
  }
  
  ngOnInit() {
    this.initForm();
  }
  
  initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      deadline: ['', [Validators.required]],
      priority: ['Second_Level', [Validators.required]]
    });
  
    this.taskForm.statusChanges.subscribe(status => {
      console.log('Form State:', {
        status,
        valid: this.taskForm.valid,
        dirty: this.taskForm.dirty,
        touched: this.taskForm.touched,
        values: this.taskForm.value
      });
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
      priority: 'Second_Level',
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
    if (this.taskForm.valid) {
      const task: Task = {
        title: this.taskForm.get('title')?.value,
        description: this.taskForm.get('description')?.value,
        deadline: new Date(this.taskForm.get('deadline')?.value),
        priority: this.taskForm.get('priority')?.value,
        projectManager: { 
          id: this.selectedManagerId 
        },
        project: { 
          projectId: this.selectedProjectId 
        },
        status: 'TO_DO',
        timer: 0
      };
      
      console.log('Submitting task:', task);
      this.save.emit(task);
      this.close.emit();
    }
  }
}