import { Answer, QuestionType } from "./comp/answersModel";

export interface Question {
  id: number;
  text: string;
  type: QuestionType;
  category: QuestionCategory;
  time: {
    minutes: number;
    seconds: number;
  };
  answers: Answer[];
  chosen: boolean;
}

export enum QuestionCategory {
  SCIENCE = "SCIENCE",
  SPORT = "SPORT",
  HISTORY = "HISTORY",
  ENTERTAINMENT = "ENTERTAINMENT",
  GEOGRAPHY = "GEOGRAPHY",
  LITERATURE = "LITERATURE",
}