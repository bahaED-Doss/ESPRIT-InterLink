export class Reponse {
    constructor(
      public evaluation: boolean,
      public reponse: string,
      public student: number,
      public questionId: number
    ) {}
  
    public static fromJson(json: any): Reponse {
      return new Reponse(
        json['evaluation'],
        json['reponse'],
        json['student'],
        json['questionId']
      );
    }
  }