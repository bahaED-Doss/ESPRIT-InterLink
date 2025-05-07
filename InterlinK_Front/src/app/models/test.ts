export class Test {
    constructor(
      public testId: number,
      public note: number,
      public titre: string,
      public typeTest: string,
      public questions: any[]
    ) {}
  
    public static fromJson(json: any): Test {
      return new Test(
        json['testId'],
        json['note'],
        json['titre'],
        json['typeTest'],
        json['questions']
      );
    }
  }