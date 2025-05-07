export class Question {
    constructor(
      public testId: number,
      public contenu: string,
      public noteAttribuee: any[]
    ) {}
  
    public static fromJson(json: any): Question {
      return new Question(json['testId'], json['contenu'], json['noteAttribuee']);
    }
  }