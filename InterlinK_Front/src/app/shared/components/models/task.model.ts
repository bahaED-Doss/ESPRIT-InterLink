export interface Task {
    taskId: number;
    title: string;
    description: string;
    deadline: Date;
    createdAt: Date;
    timer: number;
    priority: TaskPriority;
    status: TaskStatus;
    rating: SatisfactionRating;
    projectManager: User;
    student: User;
    feedbacks: Feedback[];
    project: Project;
  }
  
  export interface User {
    userId: number;
    name: string;
    role: Role;
  }
  
  export interface Project {
    projectId: number;
    name: string;
  }
  
  export interface Feedback {
    feedbackId: number;
    comment: string;
  }
  
  export enum TaskPriority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
  }
  
  export enum TaskStatus {
    TO_DO = 'TO_DO',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
  }
  
  export enum SatisfactionRating {
    OUTSTANDING= '🔥',
    GOOD= '👍',
    NEEDS_IMPROVEMENT= '🤔',
    REDO= '⚠️',
  }
  
  export enum Role {
    STUDENT = 'STUDENT',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
  }