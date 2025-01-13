import React from "react";
import { QuestionType } from "../../questionModel";
import del from "../../../../assets/delete.svg";

interface MultipleChoiceProps {
  id: number;
  text: string;
  correct: boolean;
  type: QuestionType;
  onChange: (id: number, field: string, value: unknown) => void;
  onRemove: (id: number) => void;
}

const MultipleChoiceAnswer: React.FC<MultipleChoiceProps> = ({
  id,
  text,
  correct,
  type,
  onChange, onRemove
}) => {
  const handleCorrectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(id, "correct", e.target.checked);
  };
  return (
    <li key={id} className="mc-answer__item">
      <button className="answer__remove-btn" type="button" onClick={() => onRemove(id)}>
        <img src={del} alt="icon delete answer"/>
      </button>
      <input
        className="mc-answer__input"
        type="text"
        value={text}
        onChange={(e) => onChange(id, "text", e.target.value)}
        placeholder="Answer"
        required
      />
      {type === QuestionType.SINGLE_CHOICE ? (
        <input
          className="mc-answer__checkbox"
          type="radio"
          checked={correct}
          onChange={(e) => handleCorrectChange(e)}
        />
      ) : (
        <input
          className="mc-answer__checkbox"
          type="checkbox"
          checked={correct}
          onChange={handleCorrectChange}
        />
      )}
    </li>
  );
};

export default MultipleChoiceAnswer;
