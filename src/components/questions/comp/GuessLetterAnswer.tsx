import React from "react";
import del from "../../../assets/delete.svg";

interface GuessLetterProps {
  id: number;
  letter: string;
  onChange: (id: number, value: string) => void;
  onRemove: (id: number) => void;
}

const GuessLetterAnswer: React.FC<GuessLetterProps> = ({
  id,
  letter,
  onChange, onRemove
}) => {
  return (
    <li key={id} className="gl-answer__item">
      <button
        className="answer__remove-btn"
        type="button"
        onClick={() => onRemove(id)}
      >
        <img src={del} alt="icon delete answer"/>
      </button>
      <input
        className="gl-answer__input"
        type="text"
        value={letter}
        onChange={(e) => onChange(id, e.target.value)}
        maxLength={1}
        placeholder="Enter blank letter in order"
        required
      />
    </li>
  );
};

export default GuessLetterAnswer;
