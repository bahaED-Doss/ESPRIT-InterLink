import { Feedback } from './feedback.model';

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
  feedbacks?: Feedback[];
}