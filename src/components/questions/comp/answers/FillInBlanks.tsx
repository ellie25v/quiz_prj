import React from "react";
import del from "../../../../assets/delete.svg";

interface FillInBlanksAnswerProps {
  id: number;
  blank: string;
  onChange: (id: number, field: string, value: unknown) => void;
  onRemove: (id: number) => void;
}

const FillInBlanksAnswer: React.FC<FillInBlanksAnswerProps> = ({
  id,
  blank,
  onChange,
  onRemove,
}) => {
  return (
    <li key={id} className="fib-answer__item">
      <button
        className="answer__remove-btn"
        type="button"
        onClick={() => onRemove(id)}
      >
        <img src={del} alt="icon delete answer" />
      </button>
      <input
        type="text"
        className="fib-answer__input"
        value={blank}
        placeholder="Enter blank text in order"
        onChange={(e) => onChange(id, "blank", e.target.value)}
      />
    </li>
  );
};

export default FillInBlanksAnswer;
