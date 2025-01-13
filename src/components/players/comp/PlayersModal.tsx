import { useState } from "react";
import ModalWrap from "../../comp/modalWrap/ModalWrap";
import MyBtn from "../../comp/myBtn/MyBtn";

interface PlayersModalProps {
  currentPlayer: string | null;
  onSave: (name: string) => void;
  onClose: () => void;
  onDelete: () => void;
  isOpen: boolean;
  isAlreadyExist: boolean;
}

const PlayerModal: React.FC<PlayersModalProps> = ({
  currentPlayer,
  onSave,
  onClose,
  onDelete,
  isOpen,
  isAlreadyExist,
}) => {
  const [name, setName] = useState(currentPlayer || "");

  const handleSubmit = () => {
    if (name.trim()) onSave(name.trim());
  };


  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <ModalWrap
      isOpen={isOpen}
      onClose={onClose}
      sizeWidth={600}
      sizeHeight={270}
      title={currentPlayer ? "Edit Player" : "Add Player"}
    >
      <div>
        <input
          type="text"
          className="modal__input"
          value={name}
          maxLength={12}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter player name"
        />
        {isAlreadyExist && (
          <p className="import_errors">Player with this name already exists</p>
        )}
      </div>
      <div className="modal__actions">
        {currentPlayer && (
          <MyBtn
            color="oran"
            width={160}
            text="Delete"
            handleClick={onDelete}
          />
        )}
        <MyBtn disabled={name.length===0} width={160} text="Save" handleClick={handleSubmit} />
      </div>
    </ModalWrap>
  );
};

export default PlayerModal;
