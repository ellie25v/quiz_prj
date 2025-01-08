import React from "react";
import { Answer, QuestionType } from "./answersModel";
import MultipleChoiceAnswer from "./MultipleChoiceAnswer";
import MatchingAnswer from "./MatchingAnswer";
import GuessLetterAnswer from "./GuessLetterAnswer";
import FillInBlanksAnswer from "./FillInBlanks";

interface AnswersProps {
  type: QuestionType;
  answers: Answer[];
  onChange: (id: number, field: string, value: unknown) => void;
  addAnswer: () => void;
  onRemove: (id: number) => void;
  questionBlanks?: number;
}

const Answers: React.FC<AnswersProps> = ({
  type,
  answers,
  onChange,
  addAnswer,
  onRemove,
  questionBlanks = 0,
}) => {
  const renderAnswer = (answer: Answer) => {
    switch (type) {
      case QuestionType.MULTIPLE_CHOICE:
      case QuestionType.SINGLE_CHOICE:
        if ("text" in answer && "correct" in answer) {
          return (
            <MultipleChoiceAnswer
              key={answer.id}
              id={answer.id}
              text={answer.text}
              correct={answer.correct}
              onChange={onChange}
              type={type}
              onRemove={onRemove}
            />
          );
        }
        break;

      case QuestionType.MATCHING:
        if ("left" in answer && "right" in answer) {
          return (
            <MatchingAnswer
              key={answer.id}
              id={answer.id}
              left={answer.left}
              right={answer.right}
              onChange={onChange}
              onRemove={onRemove}
            />
          );
        }
        break;

      case QuestionType.GUESS_THE_LETTER:
        if ("letter" in answer) {
          return (
            <GuessLetterAnswer
              key={answer.id}
              id={answer.id}
              letter={answer.letter}
              onChange={(id, value) => onChange(id, "letter", value)}
              onRemove={onRemove}
            />
          );
        }
        break;

      case QuestionType.FILL_IN_THE_BLANKS:
        if ("blank" in answer) {
          return (
            <FillInBlanksAnswer
              key={answer.id}
              id={answer.id}
              blank={answer.blank}
              onChange={onChange}
              onRemove={onRemove}
            />
          );
        }
        break;
      default:
        return null;
    }
  };

  return (
    <>
      <p>Answers:</p>
      <ul className="answers__section">
        {answers.map((answer) => renderAnswer(answer))}
      </ul>
      {((type !== QuestionType.FILL_IN_THE_BLANKS &&
        type !== QuestionType.GUESS_THE_LETTER &&
        answers.length < 4) ||
        (type === QuestionType.FILL_IN_THE_BLANKS &&
          questionBlanks > 0 &&
          questionBlanks > answers.length) || (answers.length < 1 ||
            type === QuestionType.GUESS_THE_LETTER)) && (
        <button className="answers__add-btn" type="button" onClick={addAnswer}>
          +
        </button>
      )}
    </>
  );
};

export default Answers;
