export interface Interview {
  interviewId?: number; // Rend l'id optionnel
  studentId: number;
  projectManagerId: number;
  applicationId: number;
  interviewDate: string;
  interviewType: string;
  statusType: string;
  lienReunion: string;
}
