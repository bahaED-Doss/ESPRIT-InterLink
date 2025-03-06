// task-form.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Task } from '../../models/task.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../../Services/task.service';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() taskModel: Task = this.getEmptyTask();
  @Input() isEditing: boolean = false;
  @Input() isOpen: boolean = false;
  @Input() selectedProjectId!: number;
  @Input() selectedManagerId!: number;
  @Output() save = new EventEmitter<Task>();
  @Output() close = new EventEmitter<void>();
  
  taskForm!: FormGroup;
  
  constructor(private fb: FormBuilder) {
    this.initForm();
  }
  
  ngOnInit() {
    this.initForm();
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskModel'] && this.taskForm) {
      this.updateFormWithTaskData();
    }
  }
  
  initForm() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      deadline: ['', [Validators.required]],
      priority: ['Second_Level', [Validators.required]]
    });
    
    if (this.isEditing && this.taskModel) {
      this.updateFormWithTaskData();
    }
  
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

  updateFormWithTaskData() {
    if (this.taskModel && this.taskForm) {
      // Format the date to YYYY-MM-DD for the date input
      let formattedDate = '';
      if (this.taskModel.deadline) {
        const date = new Date(this.taskModel.deadline);
        formattedDate = date.toISOString().split('T')[0];
      }
      
      this.taskForm.patchValue({
        title: this.taskModel.title || '',
        description: this.taskModel.description || '',
        deadline: formattedDate,
        priority: this.taskModel.priority || 'Second_Level'
      });
      
      console.log('Form updated with task data:', this.taskForm.value);
    }
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
        ...(this.isEditing && this.taskModel.taskId ? { taskId: this.taskModel.taskId } : {}),
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
        status: this.isEditing ? this.taskModel.status : 'TO_DO',
        timer: this.isEditing ? this.taskModel.timer : 0
      };
      
      console.log('Submitting task:', task);
      this.save.emit(task);
      this.close.emit();
    }
  }
}