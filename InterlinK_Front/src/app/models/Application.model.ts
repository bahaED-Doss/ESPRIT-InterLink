export enum ApplicationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED'
  }

  
  export interface Application {
internship: any;
    applicationId: number;
    status: ApplicationStatus;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    cv: string;
    internshipId: number;
  }
  