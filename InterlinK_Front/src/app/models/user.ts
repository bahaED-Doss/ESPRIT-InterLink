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
  inactivityLogoutEnabled?: boolean;  // New field for inactivity logout
  role?: Role;
  enabled?: boolean;  // Added enabled property

  [key: string]: any; 

  // Student-specific fields
  levelOfStudy?: string;
  phoneNumber?: string;
  facebook?: string;
  githubLink?: string;
  linkedin?: string;
  instagram?: string;

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
    // Optionally, you can default enabled to true if not provided:
    if (this.enabled === undefined) {
      this.enabled = true;
    }
  }
}
