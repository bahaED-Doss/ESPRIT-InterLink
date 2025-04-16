export enum Sentiment {
  POSITIVE = 'POSITIVE',
  NEUTRAL = 'NEUTRAL',
  NEGATIVE = 'NEGATIVE'
}
export interface FeedbackRequest {
  message: string;
  taskId: number;
  userId: number;
}
export interface Feedback {
  feedbackId?: number;
  message: string;
  givinBy: string;
  createdAt?: Date;
  sentiment: Sentiment;
  taskId?: number;
  task?: any;
  seen: boolean;
  hint?: string
}