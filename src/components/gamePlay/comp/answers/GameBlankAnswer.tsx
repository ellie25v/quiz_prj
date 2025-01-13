import { useRef } from "react";
import { IFillInTheBlanksAnswer } from "../../../questions/comp/answers/answersModel";
import { QuestionType } from "../../../questions/questionModel";

interface GameBlankChoiceProps {
  answers: IFillInTheBlanksAnswer[];
  writtenAnswers: string[];
  setWrittenAnswers: (listA: string[]) => void;
  isAnswered: boolean;
}

const GameBlankChoice: React.FC<GameBlankChoiceProps> = ({
  answers,
  writtenAnswers,
  setWrittenAnswers,
  isAnswered
}) => {
  const qType = answers[0].type;
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleFillAnswer = (newAn: string, blankNo: number) => {
    if (writtenAnswers.length === 0)
      setWrittenAnswers(
        answers.map((_, ind) => (ind === blankNo ? newAn : ""))
      );
    if (writtenAnswers.length > 0)
      setWrittenAnswers(
        writtenAnswers.map((a, ind) => (ind === blankNo ? newAn : a))
      );
    if (
      qType === QuestionType.GUESS_THE_LETTER &&
      inputRefs.current[blankNo + 1]
    ) {
      inputRefs.current[blankNo + 1]?.focus();
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="answers__blank-list"
      >
        {answers.map((_, ind) => (
          <label key={ind} className="blank-answer__label">
            {" "}
            Blank {ind + 1}:
            <input
              ref={(el) => (inputRefs.current[ind] = el)}
              className={`blank-answer__input ${isAnswered ? (writtenAnswers[ind] === answers[ind].blank ? "correct" : "incorrect") : ""} `}
              type="text"
              onChange={isAnswered ? ()=>{} : (e) => handleFillAnswer(e.target.value, ind)}
              maxLength={qType === QuestionType.FILL_IN_THE_BLANKS ? 100 : 1}
              placeholder={`Enter ${
                qType === QuestionType.FILL_IN_THE_BLANKS ? "word" : "letter"
              }`}
              required
            />
          </label>
        ))}
      </form>
    </>
  );
};

export default GameBlankChoice;
