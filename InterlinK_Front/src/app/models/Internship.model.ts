export enum InternshipDuration {
  FOUR_WEEKS = "FOUR_WEEKS",
  SIX_WEEKS = "SIX_WEEKS",
  EIGHT_WEEKS = "EIGHT_WEEKS",
  SIX_MONTHS = "SIX_MONTHS"
}

export enum InternshipType {
  FULL_TIME = "FULL_TIME",
  PART_TIME = "PART_TIME",
  REMOTE = "REMOTE",
  HYBRID = "HYBRID"
}
export enum RequiredSkill {
  GENIELOGICIEL = "GENIELOGICIEL",
  DATASCIENCE = "DATASCIENCE",
  BI = "BI"
}

export interface Internship {
  internshipId: number;
  title: string;
  description: string;
  localisation: string;
  duration: InternshipDuration;  // Utilisation de l'Enum
  type: InternshipType;          // Utilisation de l'Enum
  skill: RequiredSkill;          // Utilisation de l'Enum
  startDate: Date;
  endDate: Date;
  companyName: string;
  availableSpots: number;
}

  