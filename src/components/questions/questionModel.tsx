import { Answer } from "./comp/answers/answersModel";

export interface Question {
  id: number;
  text: string;
  points: number;
  type: QuestionType;
  category: QuestionCategory;
  time: {
    minutes: number;
    seconds: number;
  };
  answers: Answer[];
  selected: boolean;
  played: boolean;
}

export enum QuestionCategory {
  SCIENCE = "science",
  SPORT = "sport",
  HISTORY = "history",
  ENTERTAINMENT = "entertainment",
  GEOGRAPHY = "geography",
  LITERATURE = "literature",
  GENERAL_KNOWLEDGE = "general-knowledge",
  POP_CULTURE = "pop-culture",
}

export enum QuestionType {
  MULTIPLE_CHOICE = "multiple-choice",
  SINGLE_CHOICE = "single-choice",
  GUESS_THE_LETTER = "guess-the-letter",
  MATCHING = "matching",
  FILL_IN_THE_BLANKS = "fill-in-the-blanks",
}

export const defQ: Question = {
  id: Date.now(),
  text: "",
  category: QuestionCategory.ENTERTAINMENT,
  points: 0,
  type: QuestionType.FILL_IN_THE_BLANKS,
  time: { minutes: 0, seconds: 0 },
  answers: [],
  selected: false,
  played: false,
};

export const defSelectedQ: Question = {
  id: Date.now(),
  text: 'What city is known as "The Eternal City"?',
  category: QuestionCategory.ENTERTAINMENT,
  points: 20,
  type: QuestionType.SINGLE_CHOICE,
  time: { minutes: 0, seconds: 40 },
  answers: [
    {
      id: 1736524771561,
      type: QuestionType.SINGLE_CHOICE,
      text: "Rome",
      correct: true,
    },
    {
      id: 1736524776315,
      type: QuestionType.SINGLE_CHOICE,
      text: "Barcelona",
      correct: false,
    },
  ],
  selected: true,
  played: false,
};
