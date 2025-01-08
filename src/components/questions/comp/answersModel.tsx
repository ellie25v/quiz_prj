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
  letter: string;
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

// Question Type Enum
export enum QuestionType {
  MULTIPLE_CHOICE = "multiple-choice",
  SINGLE_CHOICE = "single-choice",
  GUESS_THE_LETTER = "guess-the-letter",
  MATCHING = "matching",
  FILL_IN_THE_BLANKS = "fill-in-the-blanks",
}
