import ModalWrap from "../../comp/modalWrap/ModalWrap";
import { defQ, Question } from "../../questions/questionModel";
import MyBtn from "../../comp/myBtn/MyBtn";

interface GameQModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (q:Question) => void;
  currentQuestion: Question | null;
}

const GameQModal: React.FC<GameQModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentQuestion,
}) => {
  const q = currentQuestion ? currentQuestion : defQ;

  return (
    <ModalWrap
      isOpen={isOpen}
      onClose={onClose}
      sizeWidth={500}
      title={"Review Question"}
    >
      <div className="gameQ__wrapper">
        <div className="gameQ__body">
          <p className="gameQ__key">
            Question:
            <span className="gameQ__val"> {q.text}</span>
          </p>
          <p className="gameQ__key">
            Category:
            <span className="gameQ__val"> {q.category.replace(/-/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}</span>
          </p>
          <p className="gameQ__key">
            Points:
            <span className="gameQ__val"> {q.points}</span>
          </p>
          <p className="gameQ__key">
            Type:
            <span className="gameQ__val"> {q.type.replace(/-/g, " ")
                .replace(/\b\w/g, (letter) => letter.toUpperCase())}</span>
          </p>
          <p className="gameQ__key">
            Time:
            <span className="gameQ__val"> {q.time.minutes}:</span>
            <span className="gameQ__val">{q.time.seconds}</span>
          </p>
        </div>
        <div className="btn-wrapper">
          <MyBtn width={200} text={"Choose"} handleClick={() =>onSelect(q)} />
        </div>
      </div>
    </ModalWrap>
  );
};

export default GameQModal;
