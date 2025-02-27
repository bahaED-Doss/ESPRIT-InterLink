export class Test {
  constructor(
    public testId: number,
    public student: number,
    public projectManager: number,
    public interview: number,
    public typeTest: string,
    public questions: any[]
  ) {}

  public static fromJson(json: any): Test {
    return new Test(
      json['testId'],
      json['student'],
      json['projectManager'],
      json['interview'],
      json['typeTest'],
      json['questions']
    );
  }
}
