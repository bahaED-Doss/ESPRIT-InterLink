export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
  }
  
  export interface Application {
    applicationId: number;
    status: ApplicationStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    cv: string;
    internshipId: number;
  }
  