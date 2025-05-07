export class Notification {
  id: number;
  message: string;
  type: 'error' | 'warning' | 'success' | 'info';
  timestamp: string; // Change from Date to string
  isRead: boolean;
  relatedTaskId?: number;
  userId?: number;
  
  constructor(data: Partial<Notification> = {}) {
    this.id = data.id || 0;
    this.message = data.message || '';
    this.type = data.type || 'info';
    this.timestamp = data.timestamp || new Date().toISOString(); // Convert to string
    this.isRead = data.isRead || false;
    this.relatedTaskId = data.relatedTaskId;
    this.userId = data.userId;
  }
}