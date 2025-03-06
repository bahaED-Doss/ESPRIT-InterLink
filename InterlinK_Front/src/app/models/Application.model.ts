import { Internship } from "./Internship.model";

export enum ApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  INTERVIEW_SCHEDULED = 'INTERVIEW_SCHEDULED'
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
  internship: Internship | null;
}