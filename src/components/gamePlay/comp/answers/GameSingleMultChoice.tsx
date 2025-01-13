import { useMemo } from "react";
import {
  Answer,
  IMultipleChoiceAnswer,
} from "../../../questions/comp/answers/answersModel";
import { QuestionType } from "../../../questions/questionModel";

interface GameSingleMultChoiceProps {
  answers: IMultipleChoiceAnswer[];
  chosenAnswers: Answer[];
  setChosenAnswers: (listA: Answer[]) => void;
  isAnswered: boolean;
}

const GameSingleMultChoice: React.FC<GameSingleMultChoiceProps> = ({
  answers,
  chosenAnswers,
  setChosenAnswers,
  isAnswered,
}) => {
  const qType = answers[0].type;

  const shuffledAnswers = useMemo(() => {
    const shuffled: IMultipleChoiceAnswer[] = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, [answers])


  const handleSelectAnswer = (newAn: IMultipleChoiceAnswer) => {
    if (qType === QuestionType.SINGLE_CHOICE) {
      setChosenAnswers([newAn]);
    } else if (qType === QuestionType.MULTIPLE_CHOICE) {
      if (chosenAnswers.some((a) => a.id === newAn.id)) {
        const newAns = chosenAnswers.filter((a) => a.id !== newAn.id);
        setChosenAnswers(newAns);
      } else {
        const newAns = [...chosenAnswers, newAn];
        setChosenAnswers(newAns);
      }
    }
  };

  return (
    <>
      <ul className="answers__singMult-list">
        {shuffledAnswers.map((a, ind) => (
          <li
            key={ind}
            onClick={isAnswered ? () => {} : () =>  handleSelectAnswer(a)}
            className={`answers__singMult-item
                ${isAnswered ? (a.correct ? "correct" : "incorrect") : ""} ${
              chosenAnswers.some((an) => a.id === an.id) ? "selected" : ""
            }`}
          >
            {a.text}
          </li>
        ))}
      </ul>
    </>
  );
};

export default GameSingleMultChoice;
