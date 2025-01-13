import { QuestionType } from "../../questionModel";

interface IAnswer {
  id: number;
  type: QuestionType;
}
// multiple choice answers
export interface IMultipleChoiceAnswer extends IAnswer {
  text: string;
  correct: boolean;
}

// matching answers
export interface IMatchingAnswer extends IAnswer {
  left: string;
  right: string;
}

// guess the letter
export interface IGuessTheLetterAnswer extends IAnswer {
  blank: string;
}

// fill in the blanks
export interface IFillInTheBlanksAnswer extends IAnswer {
  blank: string;
}

export type Answer =
  | IMultipleChoiceAnswer
  | IMatchingAnswer
  | IGuessTheLetterAnswer
  | IFillInTheBlanksAnswer;

