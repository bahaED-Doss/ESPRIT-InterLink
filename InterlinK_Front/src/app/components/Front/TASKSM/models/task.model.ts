export interface Task {
  taskId?: number;
  title: string;
  description: string;
  deadline: Date;
  createdAt?: Date;
  timer?: number;
  priority: 'Low' | 'Second_Level' | 'High';
  status?: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  rating?: 'OUTSTANDING' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'REDO';
  projectManager: {
    id: number;
  };
  student?: any;
  project: {
    projectId: number;
  };
  feedbacks?: any[];
  showDropdown?: boolean;
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
    LOW = 'Low',
    MEDIUM = 'second_Level',
    HIGH = 'High',
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