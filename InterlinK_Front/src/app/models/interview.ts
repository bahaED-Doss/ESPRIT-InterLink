export class Interview {
  constructor(
    public interviewId: number,
    public student: number,
    public managerId: number,
    public testId: number,
    public interviewDate: Date,
    public interviewType: string,
    public statusType: string,
    public lienReunion: string,
    public titre: string,
    public note: number,
    public application?: any,
    public studentByUserId?: any,
    public projectManager?: any,
    public testByTestId?: any
  ) {}

  public static fromJson(json: any): Interview {
    return new Interview(
      json['interviewId'],
      json['student'],
      json['managerId'],
      json['testId'],
      new Date(json['interviewDate']),
      json['interviewType'],
      json['statusType'],
      json['lienReunion'],
      json['titre'],
      json['note'],
      json['application'],
      json['studentByUserId'],
      json['projectManager'],
      json['testByTestId']
    );
  }
}
