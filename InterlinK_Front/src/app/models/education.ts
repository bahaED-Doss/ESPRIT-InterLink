export interface Education {
    id?: number;
    school: string;
    educationLevel: string;
    startDate?: string; // or Date
    endDate?: string;   // or Date
    currentlyAttending: boolean;
    areaOfStudy?: string;
    description?: string;
  }