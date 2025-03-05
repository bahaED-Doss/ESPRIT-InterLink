export class Question {
  constructor(
    public testId: number,
    public contenu: string,
    public reponse: string,
    public evaluation: boolean,
    public noteAttribuee: any[]
  ) {}

  public static fromJson(json: any): Question {
    return new Question(
      json['testId'],
      json['contenu'],
      json['reponse'],
      json['evaluation'],
      json['noteAttribuee']
    );
  }
}
