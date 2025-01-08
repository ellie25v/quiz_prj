import React from "react";
import del from "../../../assets/delete.svg";

interface MatchingProps {
  id: number;
  left: string;
  right: string;
  onChange: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
}

const MatchingAnswer: React.FC<MatchingProps> = ({
  id,
  left,
  right,
  onChange,
  onRemove,
}) => {
  return (
    <li key={id} className="m-answer__item">
      <button
        className="answer__remove-btn"
        type="button"
        onClick={() => onRemove(id)}
      >
        <img src={del} alt="icon delete answer"/>
      </button>
      <input
        className="m-answer__input"
        type="text"
        value={left}
        onChange={(e) => onChange(id, "left", e.target.value)}
        placeholder="Left"
        required
      />
      <span> — </span>
      <input
        className="m-answer__input"
        type="text"
        value={right}
        onChange={(e) => onChange(id, "right", e.target.value)}
        placeholder="Right"
        required
      />
    </li>
  );
};

export default MatchingAnswer;
