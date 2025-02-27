export interface Interview {
  interviewId: number | null; // Evite les erreurs sur undefined
  studentId: number;
  projectManagerId: number;
  applicationId: number;
  interviewDate: string;
  interviewType: string;
  statusType: string;
  lienReunion: string;
}
