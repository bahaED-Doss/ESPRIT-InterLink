export enum Role {
    STUDENT = 'STUDENT',
    HR = 'HR',
    PROJECT_MANAGER = 'PROJECT_MANAGER',
    ADMIN = 'ADMIN'
  }
  
  export class User {
    id?: number;
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string; // Using string for easier handling with forms
    gender?: string;
    email?: string;
    password?: string;
    role?: Role;
    [key: string]: any; 
  
    // Student-specific fields
    levelOfStudy?: string;
    phoneNumber?: string;
  
    // HR-specific fields
    companyName?: string;
    companyIdentifier?: string;
    industrySector?: string;
    companyAddress?: string;
    city?: string;
    country?: string;
    contactNumber?: string;
  
    // Project Manager-specific fields
    department?: string;
    yearsOfExperience?: number;
  
    constructor(init?: Partial<User>) {
      Object.assign(this, init);
    }
  }
  