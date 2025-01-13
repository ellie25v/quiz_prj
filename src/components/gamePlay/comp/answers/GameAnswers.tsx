import GameSingleMultChoice from "./GameSingleMultChoice";
import GameBlankAnswer from "./GameBlankAnswer";
import GameMatchingAnswer from "./GameMatchingAnswer";
import {
  IMultipleChoiceAnswer,
  IMatchingAnswer,
  Answer,
  IFillInTheBlanksAnswer,
} from "../../../questions/comp/answers/answersModel";
import { QuestionType } from "../../../questions/questionModel";

interface GameAnswersProps {
  type: QuestionType;
  answers: Answer[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  changeUserAnswers: (a: any) => void;
  userAnswers: Answer[];
  writtenAnswers: string[];
  isAnswered: boolean;
}

const GameAnswers: React.FC<GameAnswersProps> = ({
  type,
  answers,
  userAnswers,
  changeUserAnswers,
  isAnswered,
  writtenAnswers,
}) => {
  const renderAnswerGamePlay = () => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.SINGLE_CHOICE:
        return (
          <GameSingleMultChoice
            answers={answers as IMultipleChoiceAnswer[]}
            chosenAnswers={userAnswers}
            setChosenAnswers={changeUserAnswers}
            isAnswered={isAnswered}
          />
        );
      case QuestionType.FILL_IN_THE_BLANKS:
      case QuestionType.GUESS_THE_LETTER:
        return (
          <GameBlankAnswer
            answers={answers as IFillInTheBlanksAnswer[]}
            writtenAnswers={writtenAnswers}
            setWrittenAnswers={changeUserAnswers}
            isAnswered={isAnswered}
          />
        );
      case QuestionType.MATCHING:
        return (
          <GameMatchingAnswer
            answers={answers as IMatchingAnswer[]}
            matchingAnswers={userAnswers as IMatchingAnswer[]}
            setMatchingAnswers={changeUserAnswers}
            isAnswered={isAnswered}
          />
        );
      default:
        return null;
    }
  };

  return <>{renderAnswerGamePlay()}</>;
};

export default GameAnswers;
